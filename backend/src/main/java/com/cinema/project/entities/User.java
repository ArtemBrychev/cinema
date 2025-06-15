package com.cinema.project.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="user")
public class User {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    @Column(name="name", nullable=false)
    private String name;

    @ManyToOne
    @JoinColumn(name="role")
    private Role role; //Добавить реализацию как с категориями

    @Column(nullable=false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name="profile_status", length = 1500)
    private String status;

    @Column(name="user_image")
    private String userImage;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy= "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Favourite> favourites;

    //Методы
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserImage() {
        return userImage;
    }

    public void setUserImage(String userImage) {
        this.userImage = userImage;
    }


    @Override
    public String toString(){
        return "{name: " + name +
        " Role: " + role.getRoleName() + "(" +
        role.getId() + ")" + 
        " Email: " + email +
        " Status: " + status + 
        " Password: " + password + 
        "}";
    }

    public boolean equals(User user){
        boolean equalsEmail = this.email.equals(user.email);
        boolean equalsId = this.id ==  user.id;
        if(equalsEmail && equalsId){
            return true;
        }else{
            return false;
        }
    }

}
 