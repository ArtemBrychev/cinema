package com.cinema.project.dto;

public class PasswordChangeRequest {
    private String oldPassword;
    private String newPassword;

    // Геттеры
    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // Сеттеры
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}