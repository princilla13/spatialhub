# Dataset folder uploads

The Hub accepts TIFF files (`.tif` and `.tiff`) and streams them to the backend. Files are saved on the backend machine under `admin_panel/backend/uploads/<owner-id>/<dataset-id>/`, with nested folder paths preserved. MongoDB stores each relative path, size, content type, and dataset storage total.

No cloud credentials or bucket setup are required. The default storage path is next to the backend code. Set `UPLOAD_STORAGE_DIR` in the backend environment to use another folder, and optionally set `MAX_UPLOAD_FILE_BYTES` (default: 5 GiB per file).

The `uploads/` directory is ignored by Git so user data is not committed. Back up this directory with the database. If the backend runs in a container or on a host with temporary local storage, mount a persistent volume there or files may be lost when the instance is replaced. Browser folder pickers do not include empty folders; files and their nested paths are uploaded. Files over 5 GiB need multipart uploads, which this version does not implement.
