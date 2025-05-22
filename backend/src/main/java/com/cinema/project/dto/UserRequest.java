package com.cinema.project.dto;

public class UserRequest {
    private String name;
    private String email;
    private String password;

    // Геттеры
    public String getName() {
        return name;
    }

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }

    // Сеттеры
    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    @Override
    public String toString(){
        return "Name: " + name
            + " Email: " + email;
    }


}
