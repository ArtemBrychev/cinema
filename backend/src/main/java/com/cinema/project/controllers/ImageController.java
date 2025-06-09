package com.cinema.project.controllers;

import java.io.IOException;
import java.security.Principal;

import jakarta.servlet.annotation.MultipartConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cinema.project.services.S3Service;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ImageController {
    @Autowired
    S3Service s3Service;
    
    @GetMapping("api/film/cover/{id}")
    public ResponseEntity<?> getFilmCover(@PathVariable long id){
        try{
            return s3Service.getFilmCover(id);
        }catch(IOException e){
            return ResponseEntity.badRequest().body("Ошибка получения фото: " + e);
        }

    }

    @PostMapping("api/change/userpic")
    public ResponseEntity<?> changeProfilePicture(@RequestParam("file") MultipartFile file, Principal principal){
        return s3Service.uploadProfilePic(file, principal);
    }

    @GetMapping("api/user/profilepic/{userId}")
    public ResponseEntity<?> getProfilePicture(@PathVariable long userId){
        try{
            return s3Service.getProfilePicture(userId);
        }catch(IOException e){
            return ResponseEntity.badRequest().body("Ошибка с получением фото пользователя, либо ее отсутсвие");
        }
    }
}
