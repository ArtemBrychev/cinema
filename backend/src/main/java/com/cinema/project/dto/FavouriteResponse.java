package com.cinema.project.dto;

import com.cinema.project.entities.Favourite;
import java.util.Objects;

public class FavouriteResponse {
    private long id;
    private long filmId;
    private String name;
    private String director;
    private String description;

    public FavouriteResponse(Favourite favourite) {
        this.id = favourite.getId();
        this.filmId = favourite.getFilm().getId();
    }

    // Геттеры
    public long getId() {
        return id;
    }

    public long getFilmId() {
        return filmId;
    }

    public String getName() {
        return name;
    }

    public String getDirector() {
        return director;
    }

    public String getDescription() {
        return description;
    }

    // Сеттеры
    public void setId(long id) {
        this.id = id;
    }

    public void setFilmId(long filmId) {
        this.filmId = filmId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "FavouriteResponse{" +
                "id=" + id +
                ", filmId=" + filmId +
                ", name='" + name + '\'' +
                ", director='" + director + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}