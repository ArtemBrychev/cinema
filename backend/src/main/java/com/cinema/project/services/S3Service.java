package com.cinema.project.services;

import com.cinema.project.repositories.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cinema.project.entities.Film;
import com.cinema.project.entities.User;
import com.cinema.project.repositories.FilmRepository;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Paths;
import java.security.Principal;

import org.springframework.web.multipart.MultipartFile;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Autowired
    private FilmRepository filmRepository;
    @Autowired
    private UserService  userService;
    @Autowired
    private UserRepository userRepository;


    private String BUCKET_NAME;

    public S3Service(Dotenv dotenv) {
        BUCKET_NAME = dotenv.get("S3_BUCKET_NAME");
        AwsBasicCredentials creds = AwsBasicCredentials.create(
                dotenv.get("S3_ACCESS_KEYID"),
                dotenv.get("S3_SECRET_ACCESS_KEY")
        );

        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create("https://storage.yandexcloud.net"))
                .region(Region.of("ru-central1"))
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .httpClientBuilder(ApacheHttpClient.builder())
                .build();
    }

    public ResponseEntity<?> getFilmCover(long filmId) throws IOException{
        Film film = filmRepository.findById(filmId).get();
        String key = film.getCloudKey();

        return getFileFromS3(key, "image/jpeg");
    }

    public ResponseEntity<?> uploadProfilePic(MultipartFile file, Principal principal){
        User user = userService.getUserFromPrincipal(principal);
        String key = "ProfilePictures/" + user.getId() + ".jpg";

        if(user.getUserImage() == null){
            user.setUserImage(key);
            userRepository.save(user);
        }

        try{
            return writeFileToCloud(file, key);
        }catch(IOException e){
            return ResponseEntity.badRequest().body("Ошибка при сохранении файла, попробуйте другой или в иное время");
        }
    }

    public ResponseEntity<?> getProfilePicture(long userId) throws IOException{
        User user = userService.findUser(userId);
        String key = user.getUserImage();

        if(key == null){
            return ResponseEntity.badRequest().body("No photo downloaded yet");
        }


        return getFileFromS3(key, "image/jpeg");
    }

    public ResponseEntity<?> deleteProfilePic(Principal principal){
        User curruser = userService.getUserFromPrincipal(principal);
        if(curruser.getUserImage() == null){
            return ResponseEntity.badRequest().body("Нет фото профиля");
        }

        String key = curruser.getUserImage();
        curruser.setUserImage(null);
        userRepository.save(curruser);

        deleteFromS3(key);
        return ResponseEntity.ok("Фото профиля успешно удалено");
    }

    private ResponseEntity<byte[]> getFileFromS3(String key, String fallbackContentType) throws IOException {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(key)
                .build();
    
        try (var inputStream = s3Client.getObject(objectRequest)) {
            byte[] data = inputStream.readAllBytes();
    
            String contentType = inputStream.response().contentType();
            if (contentType == null) {
                contentType = fallbackContentType;
            }
    
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(data.length);
            headers.setContentDisposition(ContentDisposition.inline().filename(key).build());
    
            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        }
    }

    private ResponseEntity<?> writeFileToCloud(MultipartFile file, String key) throws IOException{
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
                file.getInputStream(),
                file.getSize()
        ));

        return ResponseEntity.ok("File uploaded successfully");
    }

    private void deleteFromS3(String key){
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(key)
                .build();

        s3Client.deleteObject(request);
    }
}
