import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CloudUpload,
  Search,
  ArrowUpDown,
  Loader2,
  Check,
  Image as ImageIcon,
  AlertTriangle,
  X,
  FileText,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  size: number;
  url: string;
}

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
}

export function ImagePicker({
  value,
  onChange,
  label,
  hint,
  placeholder = "https://...",
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("media-vault");
  const [vaultFiles, setVaultFiles] = useState<StorageFile[]>([]);
  const [productFiles, setProductFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [fallbackMode, setFallbackMode] = useState<boolean>(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and load files when dialog opens
  useEffect(() => {
    if (open) {
      void initializeBuckets();
      setSelectedFileUrl(value);
    }
  }, [open, value]);

  const initializeBuckets = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.storage.from("media-center").list("", {
        limit: 1,
      });

      const allowedMimes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "application/pdf",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      ];

      if (error) {
        console.warn(
          "Could not access 'media-center' bucket, attempting creation...",
          error.message,
        );

        const { error: createError } = await supabase.storage.createBucket("media-center", {
          public: true,
          allowedMimeTypes: allowedMimes,
        });

        if (createError) {
          console.warn("Programmatic bucket creation restricted/failed:", createError.message);
          setFallbackMode(true);
          await loadFiles(true);
          return;
        }
      } else {
        try {
          await supabase.storage.updateBucket("media-center", {
            public: true,
            allowedMimeTypes: allowedMimes,
          });
        } catch (updateErr) {
          console.warn("Could not update bucket permissions:", updateErr);
        }
      }

      setFallbackMode(false);
      await loadFiles(false);
    } catch (e) {
      console.error("Storage initialization failed:", e);
      setFallbackMode(true);
      await loadFiles(true);
    }
  };

  const loadFiles = async (isFallback: boolean) => {
    setLoading(true);
    try {
      const vaultBucket = isFallback ? "product-images" : "media-center";
      const vaultPath = isFallback ? "media-center" : "";

      // Load both vaults in parallel
      const [vaultRes, prodRes] = await Promise.all([
        supabase.storage.from(vaultBucket).list(vaultPath, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        }),
        supabase.storage.from("product-images").list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        }),
      ]);

      const { data: vaultData, error: vaultError } = vaultRes;
      const { data: prodData, error: prodError } = prodRes;

      if (vaultError) {
        toast.error(`Failed to load Media Vault: ${vaultError.message}`);
      } else if (vaultData) {
        const formattedVault = vaultData
          .filter((f) => f.name !== ".emptyFolderPlaceholder" && f.name !== ".keep")
          .map((f) => {
            const filePath = isFallback ? `media-center/${f.name}` : f.name;
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const proxyUrl = `${origin}/api/storage/${vaultBucket}/${filePath}`;
            return {
              name: f.name,
              id: f.id || f.name,
              created_at: f.created_at || new Date().toISOString(),
              size: f.metadata?.size || 0,
              url: proxyUrl,
            };
          });
        setVaultFiles(formattedVault);
      }

      if (prodError) {
        toast.error(`Failed to load Product Images: ${prodError.message}`);
      } else if (prodData) {
        const formattedProd = prodData
          .filter(
            (f) =>
              f.name !== "media-center" &&
              f.name !== ".emptyFolderPlaceholder" &&
              f.name !== ".keep",
          )
          .map((f) => {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const proxyUrl = `${origin}/api/storage/product-images/${f.name}`;
            return {
              name: f.name,
              id: f.id || f.name,
              created_at: f.created_at || new Date().toISOString(),
              size: f.metadata?.size || 0,
              url: proxyUrl,
            };
          });
        setProductFiles(formattedProd);
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred while loading files");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const bucket = fallbackMode ? "product-images" : "media-center";
      const file = files[0];
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isVideo =
        file.type.startsWith("video/") ||
        file.name.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;

      if (!isImage && !isPdf && !isVideo) {
        toast.error(`${file.name} is not a supported file type (Images, PDFs & Videos only).`);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 25MB limit.`);
        return;
      }

      const toastId = toast.loading(`Optimizing & uploading ${file.name}...`);

      let blob: Blob = file;
      let ext = file.name.split(".").pop() || (isPdf ? "pdf" : "mp4");
      let contentType = file.type || (isPdf ? "application/pdf" : "video/mp4");

      if (isImage) {
        const comp = await compressImage(file);
        blob = comp.blob;
        ext = comp.ext;
        contentType = comp.contentType;
      }

      const uniqueId = crypto.randomUUID();
      const baseName = file.name
        .substring(0, file.name.lastIndexOf("."))
        .replace(/[^a-zA-Z0-9-_]/g, "_");
      const fileName = `${baseName}_${uniqueId}.${ext}`;
      const filePath = fallbackMode ? `media-center/${fileName}` : fileName;

      const { error } = await supabase.storage.from(bucket).upload(filePath, blob, {
        cacheControl: "31536000",
        upsert: false,
        contentType,
      });

      if (error) {
        toast.error(`Upload failed for ${file.name}: ${error.message}`, { id: toastId });
        return;
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const proxyUrl = `${origin}/api/storage/${bucket}/${filePath}`;

      toast.success(`${file.name} uploaded successfully!`, { id: toastId });
      setSelectedFileUrl(proxyUrl);
      await loadFiles(fallbackMode);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during image upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files);
    }
  };

  const activeFilesList = activeTab === "media-vault" ? vaultFiles : productFiles;
  const filteredFiles = activeFilesList.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "date-desc")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "date-asc")
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "size-desc") return b.size - a.size;
    if (sortBy === "size-asc") return a.size - b.size;
    return 0;
  });

  const handleConfirmSelection = () => {
    onChange(selectedFileUrl);
    setOpen(false);
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
      )}
      {hint && <p className="text-[10px] text-muted-foreground/70">{hint}</p>}

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-xs font-mono flex-1 h-9 bg-muted/20"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange("")}
            className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
            title="Clear Image"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-xs h-9 shrink-0 gap-1.5"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Choose Image
        </Button>
      </div>

      {value && (
        <div className="relative group rounded-md border border-border overflow-hidden bg-accent/10 max-w-sm mt-1">
          <img
            src={value}
            alt="Preview"
            className="w-full h-24 object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 bg-card border border-border overflow-hidden">
          <DialogHeader className="pb-2 border-b border-border shrink-0">
            <DialogTitle className="font-display uppercase text-lg tracking-wide flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Select Asset from Media Library
            </DialogTitle>
          </DialogHeader>

          {/* Grid/Layout container inside modal */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0 flex flex-col">
            {fallbackMode && (
              <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-amber-600 text-xs">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>Note: Using public fallback folder on product-images bucket.</span>
              </div>
            )}

            {/* Drag & Drop upload panel inside modal */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 shrink-0",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-border hover:border-primary/50 hover:bg-accent/10",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,video/*"
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files)}
                disabled={uploading}
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-xs font-bold text-primary uppercase">
                    Uploading & Compressing...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <CloudUpload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-xs font-bold uppercase text-foreground">
                    Drag & Drop to upload a new asset
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    or click to browse local files (PNG, JPEG, WEBP, SVG, GIF up to 25MB)
                  </p>
                </div>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border shrink-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="bg-muted/30 p-0.5 rounded-md self-start"
              >
                <TabsList className="bg-transparent h-8 p-0">
                  <TabsTrigger
                    value="media-vault"
                    className="text-[10px] font-bold uppercase tracking-wider px-3 h-7"
                  >
                    Media Vault ({vaultFiles.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="product-images"
                    className="text-[10px] font-bold uppercase tracking-wider px-3 h-7"
                  >
                    Product Images ({productFiles.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search file..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-8 text-xs bg-muted/20"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-muted/40 border border-border rounded h-8 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground outline-none cursor-pointer"
                  >
                    <option value="date-desc">Newest</option>
                    <option value="date-asc">Oldest</option>
                    <option value="name-asc">A-Z</option>
                    <option value="name-desc">Z-A</option>
                    <option value="size-desc">Largest</option>
                    <option value="size-asc">Smallest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File list / Grid */}
            <div className="flex-1 min-h-[200px] overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md bg-muted/20" />
                  ))}
                </div>
              ) : sortedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-md">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    No assets found
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    Drag a file here or adjust search filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {sortedFiles.map((file) => {
                    const isSelected = selectedFileUrl === file.url;
                    const isPdf = file.name.toLowerCase().endsWith(".pdf");
                    const isVideo = file.name.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;

                    return (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFileUrl(file.url)}
                        className={cn(
                          "group relative aspect-square rounded-md border overflow-hidden cursor-pointer shadow-sm transition-all duration-200 select-none flex flex-col bg-accent/5",
                          isSelected
                            ? "border-primary ring-2 ring-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:scale-[1.01]",
                        )}
                      >
                        {isPdf ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-3">
                            <FileText className="h-10 w-10 text-primary mb-1" />
                            <span className="text-[9px] font-semibold text-muted-foreground truncate w-full text-center">
                              {file.name}
                            </span>
                          </div>
                        ) : isVideo ? (
                          <div className="flex-1 relative bg-black/10 flex items-center justify-center overflow-hidden">
                            <video
                              src={file.url}
                              className="w-full h-full object-cover"
                              preload="metadata"
                              muted
                            />
                            <Play className="absolute h-6 w-6 text-white/80" />
                          </div>
                        ) : (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover flex-1"
                            loading="lazy"
                          />
                        )}

                        {/* File Details Bar */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[1px] p-1 px-1.5 flex items-center justify-between text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="truncate max-w-[70%] font-medium" title={file.name}>
                            {file.name}
                          </span>
                          <span className="tabular-nums opacity-80 shrink-0 ml-1">
                            {formatBytes(file.size)}
                          </span>
                        </div>

                        {/* Selected overlay checkmark */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-4.5 w-4.5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border shrink-0 flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground truncate max-w-[50%] hidden sm:inline-block">
              {selectedFileUrl ? `Selected URL: ${selectedFileUrl}` : "No image selected"}
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-xs uppercase font-bold tracking-wider"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={!selectedFileUrl}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase font-bold tracking-wider px-4"
              >
                Confirm Selection
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
