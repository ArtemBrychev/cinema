package com.cinema.project.controllers;

import com.cinema.project.dto.PasswordChangeRequest;
import com.cinema.project.dto.TokenResponse;
import com.cinema.project.dto.UserNameSettings;
import com.cinema.project.dto.UserRequest;
import com.cinema.project.entities.User;
import com.cinema.project.repositories.UserRepository;
import com.cinema.project.security.JwtUtils;
import com.cinema.project.security.UserDetailsWrapper;
import com.cinema.project.services.UserService;

import jakarta.security.auth.message.callback.PrivateKeyCallback;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    public UserController(UserService userService, JwtUtils jwt, AuthenticationManager auth){
        this.userService = userService;
        this.authManager = auth;
        this.jwtUtils = jwt;
    }
    
    @GetMapping("api/profile/{id}")
    public ResponseEntity<?> getProfileInfo(@PathVariable long id, Principal principal){
        System.out.println("Getting profile info on user");
        return userService.getUserProfileInfo(id, principal);
    }

    @PostMapping("api/login")
    public ResponseEntity<?> createAuthToken(@RequestBody UserRequest userRequest){
        System.out.println("UserController.createAuthToken(api/login)");
        try{
            authManager.authenticate(new UsernamePasswordAuthenticationToken(userRequest.getEmail(), userRequest.getPassword()));
            System.out.println("    Request from " + userRequest + " is ok");
        }catch(BadCredentialsException e){
            System.out.println("    Request from " + userRequest + " is not ok");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        
        UserDetails userDetails = userDetailsService.loadUserByUsername(userRequest.getEmail());
        System.out.println("UserController.createAuthToken(api/login).userDeatils " + userDetails.getUsername());
        String token = jwtUtils.generateToken(userDetails);

        System.out.println("UserController.createAuthToken(api/login).token.username " + jwtUtils.getUsername(token));
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @PostMapping("api/register")
    public ResponseEntity<?> registerNewUser(@RequestBody UserRequest userRequest){
        System.out.println("Запрос получен, хоть что то");
        if(userService.checkEmail(userRequest.getEmail())){
            userService.registerNewUser(userRequest);
            return ResponseEntity.ok("Пользователь зарегистрирован");
        }else{
            System.out.println("Проблема с email");
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Пользователь с данным логином уже существует"));
        }

    }

    @DeleteMapping("api/delete/user")
    public ResponseEntity<?> deleteProfile(Principal principal){
        return userService.deleteUser(principal);
    }

    @PutMapping("api/change/usernamtus")
    public ResponseEntity<?> setNameAndStatus(@RequestBody UserNameSettings newdata, Principal principal){
        User curruser = userService.getUserFromPrincipal(principal);
        if(curruser!=null){
            if(newdata.getName()!=null){
                return userService.changeUserBasicData(newdata, curruser);
            }else{
                return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Имя не может быть пустым"));
            }
        }else{
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Пользователь не найден"));
        }
    }

    @PutMapping("api/change/userpassword")
    public ResponseEntity<?> changeUserPassword(@RequestBody PasswordChangeRequest passwordRequest, Principal principal){
        return userService.changePassword(passwordRequest, principal);
    }
}
