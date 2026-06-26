import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  CloudUpload,
  Copy,
  Check,
  Trash2,
  Maximize2,
  Search,
  ArrowUpDown,
  Loader2,
  Link as LinkIcon,
  Calendar,
  HardDrive,
  Image as ImageIcon,
  AlertTriangle,
  FileText,
  Play,
} from "lucide-react";
import { toast } from "sonner";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  size: number;
  metadata?: {
    size: number;
    mimetype: string;
  };
  url: string;
}

export function MediaCenterPage() {
  const [activeTab, setActiveTab] = useState<string>("media-vault");
  const [vaultFiles, setVaultFiles] = useState<StorageFile[]>([]);
  const [productFiles, setProductFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [importingUrl, setImportingUrl] = useState<boolean>(false);

  // Storage fallback tracking
  const [fallbackMode, setFallbackMode] = useState<boolean>(false);

  // Copied visual feedback mapping (file name/url -> boolean)
  const [copiedState, setCopiedState] = useState<Record<string, boolean>>({});

  // Full screen details modal
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ w: number; h: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and load files
  useEffect(() => {
    void initializeBuckets();
  }, []);

  const initializeBuckets = async () => {
    setLoading(true);
    try {
      // 1. Try to list from the 'media-center' bucket
      const { data, error } = await supabase.storage.from("media-center").list("", {
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

        // 2. Try to create the bucket programmatically
        const { error: createError } = await supabase.storage.createBucket("media-center", {
          public: true,
          allowedMimeTypes: allowedMimes,
        });

        if (createError) {
          console.warn("Programmatic bucket creation restricted/failed:", createError.message);
          console.log(
            "Using 'product-images' bucket inside 'media-center/' folder as a zero-fail fallback.",
          );
          setFallbackMode(true);
          await loadFiles(true);
          return;
        }
      } else {
        // The bucket exists, but we want to ensure application/pdf and videos are allowed.
        // We attempt to update the allowed mime types in case it was restricted to images only.
        try {
          await supabase.storage.updateBucket("media-center", {
            public: true,
            allowedMimeTypes: allowedMimes,
          });
        } catch (updateErr) {
          console.warn(
            "Could not update bucket permissions (might be lacking admin credentials):",
            updateErr,
          );
        }
        try {
          await supabase.storage.updateBucket("product-images", {
            public: true,
            allowedMimeTypes: allowedMimes,
          });
        } catch (updateErr) {
          console.warn("Could not update product-images bucket permissions:", updateErr);
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
        // Filter out folder placeholders (e.g. .keep) and map to full details
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
        // Filter out folder prefixes and map
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

  // Upload handler
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;

    try {
      const bucket = fallbackMode ? "product-images" : "media-center";

      for (const file of Array.from(files)) {
        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const isVideo =
          file.type.startsWith("video/") ||
          file.name.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;

        if (!isImage && !isPdf && !isVideo) {
          toast.error(`${file.name} is not a supported file type (Images, PDFs & Videos only).`);
          continue;
        }
        if (file.size > 25 * 1024 * 1024) {
          toast.error(`${file.name} exceeds the 25MB limit.`);
          continue;
        }

        const toastId = toast.loading(`Optimizing & uploading ${file.name}...`);

        let blob: Blob = file;
        let ext = file.name.split(".").pop() || (isPdf ? "pdf" : "mp4");
        let contentType = file.type || (isPdf ? "application/pdf" : "video/mp4");

        // 1. Compressing (images only)
        if (isImage) {
          const comp = await compressImage(file);
          blob = comp.blob;
          ext = comp.ext;
          contentType = comp.contentType;
        }

        // 2. Uploading
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
          continue;
        }

        toast.success(`${file.name} uploaded successfully!`, { id: toastId });
        successCount++;
      }

      if (successCount > 0) {
        await loadFiles(fallbackMode);
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during image upload.");
    } finally {
      setUploading(false);
    }
  };

  // Import external URL
  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const targetUrl = urlInput.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      toast.error("Please enter a valid HTTP or HTTPS URL.");
      return;
    }

    setImportingUrl(true);
    const toastId = toast.loading("Fetching external file...");

    try {
      // 1. Try to fetch the URL as a blob
      const response = await fetch(targetUrl).catch(() => null);
      if (!response || !response.ok) {
        throw new Error(
          "Could not fetch the file from the remote URL due to CORS restrictions or network errors.",
        );
      }

      const blobData = await response.blob();
      const isImg = blobData.type.startsWith("image/");
      const isPdf = blobData.type === "application/pdf" || targetUrl.toLowerCase().endsWith(".pdf");
      const isVid =
        blobData.type.startsWith("video/") ||
        targetUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;

      if (!isImg && !isPdf && !isVid) {
        throw new Error("The specified URL does not point to a valid image, PDF or video file.");
      }

      // Extract filename from URL or generate one
      let fileName = isImg ? "imported_image" : isPdf ? "imported_doc.pdf" : "imported_video.mp4";
      try {
        const urlObj = new URL(targetUrl);
        const pathParts = urlObj.pathname.split("/");
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.includes(".")) {
          fileName = lastPart;
        }
      } catch {}

      // Convert Blob to a File
      const file = new File([blobData], fileName, { type: blobData.type });

      let blob: Blob = file;
      let ext = file.name.split(".").pop() || (isPdf ? "pdf" : "mp4");
      let contentType = file.type || (isPdf ? "application/pdf" : "video/mp4");

      // Compress (images only)
      if (isImg) {
        toast.loading("Optimizing image file...", { id: toastId });
        const comp = await compressImage(file);
        blob = comp.blob;
        ext = comp.ext;
        contentType = comp.contentType;
      }

      // Upload to bucket
      const bucket = fallbackMode ? "product-images" : "media-center";
      const uniqueId = crypto.randomUUID();
      const newName = `imported_${uniqueId}.${ext}`;
      const filePath = fallbackMode ? `media-center/${newName}` : newName;

      toast.loading("Uploading to Supabase Vault...", { id: toastId });
      const { error } = await supabase.storage.from(bucket).upload(filePath, blob, {
        cacheControl: "31536000",
        upsert: false,
        contentType,
      });

      if (error) throw error;

      toast.success("File successfully imported to Media Vault!", { id: toastId });
      setUrlInput("");
      await loadFiles(fallbackMode);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message ||
          "Failed to fetch file. This remote server may restrict direct downloads (CORS). Please download it locally and drag-and-drop instead.",
        { id: toastId, duration: 6000 },
      );
    } finally {
      setImportingUrl(false);
    }
  };

  // Import picture from Product Images to Media Center Vault
  const importProductImageToVault = async (prodFile: StorageFile) => {
    const toastId = toast.loading(`Importing ${prodFile.name} into Media Vault...`);
    try {
      // 1. Fetch file as blob from public URL
      const response = await fetch(prodFile.url);
      if (!response.ok) throw new Error("Could not download target product image.");

      const blob = await response.blob();
      const bucket = fallbackMode ? "product-images" : "media-center";
      const filePath = fallbackMode ? `media-center/${prodFile.name}` : prodFile.name;

      // 2. Upload to vault
      const { error } = await supabase.storage.from(bucket).upload(filePath, blob, {
        cacheControl: "31536000",
        upsert: true,
        contentType: blob.type || "image/webp",
      });

      if (error) throw error;

      toast.success(`${prodFile.name} is now available in the Media Vault!`, { id: toastId });
      await loadFiles(fallbackMode);
      setActiveTab("media-vault");
    } catch (e: any) {
      console.error(e);
      toast.error(`Import failed: ${e.message || "Unknown error"}`, { id: toastId });
    }
  };

  // Delete file handler
  const handleDelete = async (file: StorageFile, isProductBucket = false) => {
    const bucket = isProductBucket
      ? "product-images"
      : fallbackMode
        ? "product-images"
        : "media-center";
    const filePath = isProductBucket
      ? file.name
      : fallbackMode
        ? `media-center/${file.name}`
        : file.name;

    if (!confirm(`Are you sure you want to permanently delete "${file.name}"?`)) return;

    const toastId = toast.loading("Deleting file...");
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        toast.error(`Deletion failed: ${error.message}`, { id: toastId });
      } else {
        toast.success("File deleted successfully", { id: toastId });
        await loadFiles(fallbackMode);
        if (selectedFile?.id === file.id) {
          setSelectedFile(null);
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error("An unexpected error occurred during deletion", { id: toastId });
    }
  };

  // Copy to clipboard with visual feedback icon
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Image URL copied to clipboard!");

      setCopiedState((prev) => ({ ...prev, [url]: true }));
      setTimeout(() => {
        setCopiedState((prev) => ({ ...prev, [url]: false }));
      }, 2000);
    } catch (e) {
      toast.error("Copy failed");
    }
  };

  // Drag and Drop handlers
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

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Open details modal and resolve aspect ratio details
  const openDetails = (file: StorageFile) => {
    setSelectedFile(file);
    setImageDimensions(null);

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = file.url;
  };

  // Filtering and Sorting logic
  const activeFilesList = activeTab === "media-vault" ? vaultFiles : productFiles;

  const filteredFiles = activeFilesList.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "date-asc") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === "size-desc") {
      return b.size - a.size;
    }
    if (sortBy === "size-asc") {
      return a.size - b.size;
    }
    return 0;
  });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Fallback alert banners */}
      {fallbackMode && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <div>
            <span className="font-bold uppercase">Note:</span> The dedicated{" "}
            <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">media-center</code>{" "}
            storage bucket does not exist or isn't accessible. Files are being automatically
            organized inside the{" "}
            <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">product-images</code>{" "}
            bucket in a{" "}
            <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">media-center/</code>{" "}
            subfolder.
          </div>
        </div>
      )}

      {/* Upload Zone & Form Panel */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload dropzone card */}
        <Card className="md:col-span-2 border-border/80 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 hover:border-primary/40">
          <CardContent className="p-6">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,video/*"
                multiple
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files)}
                disabled={uploading}
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="font-display font-bold uppercase tracking-wider text-sm text-primary">
                    Optimizing & Uploading...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Processing and uploading files to Supabase
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`p-4 rounded-full bg-primary/10 transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`}
                  >
                    <CloudUpload className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold uppercase text-sm tracking-wide text-foreground">
                      Drag & Drop your files here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse local files
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      PNG
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      JPEG
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      WEBP
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      SVG
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      GIF
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded">
                      PDF
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-200/50 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded">
                      VIDEO
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* URL Import card */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <LinkIcon className="h-5 w-5" />
                <h3 className="font-display text-base font-bold uppercase tracking-wide">
                  Import from URL
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste an image, PDF or video link below. Antigravity will download, process, and
                host it strictly inside Supabase Storage.
              </p>
            </div>

            <form onSubmit={handleUrlImport} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="url-input"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  File Link
                </Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/document.pdf or .mp4"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={importingUrl || uploading}
                  className="bg-muted/35"
                />
              </div>

              <Button
                type="submit"
                disabled={importingUrl || uploading || !urlInput.trim()}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold uppercase tracking-wider text-xs h-10 transition-all duration-300"
              >
                {importingUrl ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Add Image URL"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Main Asset Directory Panel */}
      <Card className="border-border/80 bg-card/40 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Toolbar: Tabs, Search & Sort */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
              {/* Category tabs */}
              <TabsList className="bg-muted/50 p-1 self-start">
                <TabsTrigger
                  value="media-vault"
                  className="font-display font-bold uppercase tracking-wider text-xs px-4 py-2 gap-2"
                >
                  <HardDrive className="h-3.5 w-3.5" />
                  Media Vault ({vaultFiles.length})
                </TabsTrigger>
                <TabsTrigger
                  value="product-images"
                  className="font-display font-bold uppercase tracking-wider text-xs px-4 py-2 gap-2"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Product Images ({productFiles.length})
                </TabsTrigger>
              </TabsList>

              {/* Filtering / Sorting options */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs bg-muted/20"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto bg-muted/40 border border-border rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground outline-none transition hover:border-primary/50"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="name-asc">Filename A-Z</option>
                    <option value="name-desc">Filename Z-A</option>
                    <option value="size-desc">Largest Size</option>
                    <option value="size-asc">Smallest Size</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded border border-border bg-muted/10 p-2 flex flex-col justify-between"
                  >
                    <Skeleton className="w-full h-full rounded" />
                  </div>
                ))}
              </div>
            ) : sortedFiles.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border/80 rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                  No images found
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search keywords or search parameters."
                    : activeTab === "media-vault"
                      ? "Upload an image using drag & drop or enter an image URL to populate the Vault."
                      : "No files found in the product-images storage bucket."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {sortedFiles.map((file) => {
                  const isCopied = copiedState[file.url] || false;

                  return (
                    <div
                      key={file.id}
                      className="group relative aspect-square rounded-lg border border-border bg-muted/10 overflow-hidden shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md hover:scale-[1.01]"
                    >
                      {/* STRICT 1:1 Image Area */}
                      {file.name.toLowerCase().endsWith(".pdf") ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 select-none p-4">
                          <FileText className="h-16 w-16 text-primary mb-2" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center truncate w-full">
                            {file.name}
                          </span>
                        </div>
                      ) : file.name.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null ? (
                        <div className="w-full h-full relative bg-muted/20 flex items-center justify-center overflow-hidden">
                          <video
                            src={file.url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-10 w-10 text-white opacity-85 hover:scale-110 transition duration-300" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      {/* Glassmorphic Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                        {/* Top: Badges & Info */}
                        <div className="flex items-start justify-between">
                          <span className="text-[9px] font-black tracking-widest bg-primary/95 text-primary-foreground px-1.5 py-0.5 rounded uppercase">
                            {file.name.split(".").pop() || "IMG"}
                          </span>
                          <span className="text-[10px] font-semibold text-white/90 tabular-nums">
                            {formatBytes(file.size)}
                          </span>
                        </div>

                        {/* Middle: File Name */}
                        <div className="text-center px-1">
                          <p
                            className="text-xs text-white font-medium truncate w-full"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                        </div>

                        {/* Bottom: Visual Interactive Actions */}
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Copy URL with copy-to-clipboard icon */}
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={() => void handleCopyUrl(file.url)}
                            className="h-8 w-8 rounded-full shadow transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                            title="Copy image link"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Full Screen Zoom Button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={() => openDetails(file)}
                            className="h-8 w-8 rounded-full shadow transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                            title="View details"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>

                          {/* Import/Delete */}
                          {activeTab === "product-images" ? (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              onClick={() => void importProductImageToVault(file)}
                              className="h-8 w-8 rounded-full shadow transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                              title="Import to Vault"
                            >
                              <CloudUpload className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={() => void handleDelete(file)}
                              className="h-8 w-8 rounded-full shadow transition-all duration-200 hover:scale-105"
                              title="Permanently delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Details & Aspect Ratio Zoom Modal */}
      <Dialog open={selectedFile !== null} onOpenChange={(open) => !open && setSelectedFile(null)}>
        {selectedFile && (
          <DialogContent className="max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <DialogHeader className="pr-6 max-w-full">
              <DialogTitle
                className="font-display text-sm font-bold uppercase tracking-wider break-all whitespace-normal"
                title={selectedFile.name}
              >
                {selectedFile.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* File Preview */}
              <div className="relative aspect-video rounded border border-border bg-muted/20 overflow-hidden flex items-center justify-center p-2">
                {selectedFile.name.toLowerCase().endsWith(".pdf") ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <FileText className="h-16 w-16 text-primary mb-2" />
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs font-bold uppercase tracking-wider border-border/80 text-foreground hover:bg-surface"
                    >
                      <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">
                        Open Document in New Tab
                      </a>
                    </Button>
                  </div>
                ) : selectedFile.name.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null ? (
                  <video
                    src={selectedFile.url}
                    controls
                    className="max-h-full max-w-full rounded"
                  />
                ) : (
                  <img
                    src={selectedFile.url}
                    alt=""
                    className="max-h-full max-w-full object-contain rounded"
                  />
                )}
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-4 rounded border border-border/80">
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wide font-semibold block text-[10px]">
                    Dimensions
                  </span>
                  <span className="font-bold tabular-nums">
                    {selectedFile.name.toLowerCase().endsWith(".pdf")
                      ? "N/A — Document"
                      : selectedFile.name.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null
                        ? "N/A — Video"
                        : imageDimensions
                          ? `${imageDimensions.w} × ${imageDimensions.h} px`
                          : "Loading dims..."}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wide font-semibold block text-[10px]">
                    File Size
                  </span>
                  <span className="font-bold tabular-nums">{formatBytes(selectedFile.size)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wide font-semibold block text-[10px]">
                    Extension
                  </span>
                  <span className="font-bold uppercase tracking-wider">
                    {selectedFile.name.split(".").pop() || "WEBP"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wide font-semibold block text-[10px]">
                    Created Date
                  </span>
                  <span className="font-bold flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(selectedFile.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Public Hostable URL Input */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Public URL Link
                </Label>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-1 min-w-0">
                    <Input
                      readOnly
                      value={selectedFile.url}
                      className="text-xs h-9 bg-muted/40 font-mono w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 border-border transition hover:border-primary/50"
                    onClick={() => void handleCopyUrl(selectedFile.url)}
                    title="Copy URL"
                  >
                    {copiedState[selectedFile.url] ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              {activeTab === "media-vault" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void handleDelete(selectedFile)}
                  className="font-bold uppercase tracking-wider text-xs"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete File
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedFile(null)}
                className="font-bold uppercase tracking-wider text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
