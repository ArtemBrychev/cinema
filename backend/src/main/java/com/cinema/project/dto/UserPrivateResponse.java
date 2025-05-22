package com.cinema.project.dto;

import com.cinema.project.entities.User;

public class UserPrivateResponse {
    private String name;
    private String status;
    private long id;
    private String email;

    // Геттеры
    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }


    // Сеттеры
    public void setName(String name) {
        this.name = name;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void valueOf(User user){
        name = user.getName();
        id = user.getId();
        email = user.getEmail();
        status = user.getStatus();
    }
}
