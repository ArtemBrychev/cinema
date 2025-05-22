package com.cinema.project.dto;

import com.cinema.project.entities.User;

public class UserPublicResponse {
    private String name;
    private String status;
    private long id;

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

    public void valueOf(User user){
        name = user.getName();
        id = user.getId();
        status = user.getStatus();
    }
}
