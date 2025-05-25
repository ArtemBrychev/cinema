package com.cinema.project.dto;

import com.cinema.project.entities.Favourite;
import java.util.Objects;

public class FavouriteResponse {
    private long id;
    private long filmId;

    public FavouriteResponse(Favourite favourite){
        this.id = favourite.getId();
        this.filmId = favourite.getFilm().getId();
    }

    public long getId() {
        return id;
    }

    public long getFilmId() {
        return filmId;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setFilmId(long filmId) {
        this.filmId = filmId;
    }

    @Override
    public String toString() {
        return "FavouriteResponse{" +
                "id=" + id +
                ", filmId=" + filmId +
                '}';
    }
}