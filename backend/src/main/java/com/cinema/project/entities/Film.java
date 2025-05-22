package com.cinema.project.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "film")
public class Film {

    //Поля сущности
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="name", nullable=false, length=100)
    private String name;
    
    @Column(name="director", nullable=false, length=50)
    private String director;

    @Column(name="description", nullable=false, length=700)
    private String description;

    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name="rutube_link", nullable=false)
    private String rutubeLink;

    @Column(name="like_count")
    private long likeCount;

    @Column(name="dislike_count")
    private long dislikeCount;

    // Методы
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

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category categoryId) {
        this.category = categoryId;
    }

    public String getRutubeLink() {
        return rutubeLink;
    }

    public void setRutubeLink(String rutubeLink) {
        this.rutubeLink = rutubeLink;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public long getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(long dislikeCount) {
        this.dislikeCount = dislikeCount;
    }

    @Override
    public String toString(){
        String result = "Film{\nname: %s, desc: %s, dir: %s, link: %s \n}";
        return String.format(result, name, description, director, rutubeLink);
    }
}

