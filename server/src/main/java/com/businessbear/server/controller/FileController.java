package com.businessbear.server.controller;

import com.businessbear.server.dto.ApiResponse;
import com.businessbear.server.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        
        // Return a relative URL which adapts automatically to localhost or custom host domains
        String fileDownloadUrl = "/uploads/" + fileName;
        
        return ResponseEntity.ok(ApiResponse.success(fileDownloadUrl, "File uploaded successfully"));
    }
}
