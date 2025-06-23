"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

export function UploadImageInput({
  value,
  onChange,
  maxFiles = 1,
}: {
  value: File[] | string[];
  onChange: (files: File[] | string[]) => void;
  maxFiles?: number;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = acceptedFiles.slice(0, maxFiles);
      onChange(files);

      // Create previews
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    },
    [maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop images here"
              : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <Button variant="outline" size="sm" type="button">
            Select Images
          </Button>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="rounded-lg object-cover w-full h-32"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedPreviews = [...previews];
                  updatedPreviews.splice(index, 1);
                  setPreviews(updatedPreviews);

                  if (value) {
                    const updatedValue = Array.isArray(value)
                      ? [...value]
                      : [value];
                    updatedValue.splice(index, 1);
                    onChange(updatedValue as File[] | string[]);
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
