package com.cinema.project.services;

import com.cinema.project.dto.PasswordChangeRequest;
import com.cinema.project.dto.UserNameSettings;
import com.cinema.project.dto.UserPrivateResponse;
import com.cinema.project.dto.UserPublicResponse;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import javax.management.relation.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.project.dto.UserRequest;
import com.cinema.project.entities.User;
import com.cinema.project.repositories.RoleRepository;
import com.cinema.project.repositories.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public User findUser(long id){
        return userRepository.findById(id);
    }

    public void createNewUser(User user){
        user.setRole(roleRepository.findById((long) 1));
        userRepository.save(user);
    }

    public void printListOfUsers(){
        List<User> users = userRepository.findAll();
        for(int i = 0; i < users.size(); i++){
            System.out.println(users.get(i));
        }
    }

    public User loadByUsername(String email){
        return userRepository.findByEmail(email);
    }

    public boolean checkEmail(String email){
        if(userRepository.findByEmail(email)==null){
            return true;
        }else{
            return false;
        }
        
    }

    public boolean registerNewUser(UserRequest userRequest){
        User newuser = new User();
        if(userRequest.getPassword().length() < 8) return false;
        String encodedpassword = passwordEncoder.encode(userRequest.getPassword());
        newuser.setEmail(userRequest.getEmail());
        newuser.setName(userRequest.getName());
        newuser.setPassword(encodedpassword);

        createNewUser(newuser);
        return true;
    }


    public ResponseEntity<?> getUserProfileInfo(long id, Principal principal){
        User requestUser = userRepository.findById(id);
        if(principal == null){
            UserPublicResponse userPublicResponse = new UserPublicResponse();
            userPublicResponse.valueOf(requestUser);
            return ResponseEntity.ok(userPublicResponse);
        }
        User currentUser = userRepository.findByEmail(principal.getName());
        if (requestUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Пользователь не найден"));
        }        

        if(requestUser.equals(currentUser)){
            UserPrivateResponse userPrivateResponse = new UserPrivateResponse();
            userPrivateResponse.valueOf(currentUser);
            return ResponseEntity.ok(userPrivateResponse);
        }else{
            UserPublicResponse userPublicResponse = new UserPublicResponse();
            userPublicResponse.valueOf(requestUser);
            return ResponseEntity.ok(userPublicResponse);
        }
    }


    public User getUserFromPrincipal(Principal principal){
        return userRepository.findByEmail(principal.getName());
    }


    public ResponseEntity<?> deleteUser(Principal principal) {
        try {
            User targetUser = getUserFromPrincipal(principal);
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь не найден.");
            }
            userRepository.delete(targetUser);
            return ResponseEntity.ok(true);
    
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при удалении пользователя: " + e.getMessage());
        }
    }

    public ResponseEntity<?> changeUserBasicData(UserNameSettings newdata, User user){
        user.setName(newdata.getName());
        user.setStatus(newdata.getStatus());

        userRepository.save(user);
        return ResponseEntity.ok("Изменения сохранены");
    }

    public ResponseEntity<?> changePassword(PasswordChangeRequest passwordRequest, Principal principal) {
        User curruser = getUserFromPrincipal(principal);
        if (curruser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь не найден");
        }
    
        if (!passwordEncoder.matches(passwordRequest.getOldPassword(), curruser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный старый пароль");
        }
    
        if (passwordRequest.getNewPassword() == null || passwordRequest.getNewPassword().length() < 8
            || passwordRequest.getNewPassword().length()>40) {
            return ResponseEntity.badRequest().body("Пароль должен быть от 8 до 40 символов");
        }
    
        String encodedPassword = passwordEncoder.encode(passwordRequest.getNewPassword());
        curruser.setPassword(encodedPassword);
        userRepository.save(curruser);
    
        return ResponseEntity.ok("Пароль успешно изменён");
    }
    
}
