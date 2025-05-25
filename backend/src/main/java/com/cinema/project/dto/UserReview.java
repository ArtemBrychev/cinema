package com.cinema.project.dto;

import java.time.LocalDate;

import com.cinema.project.entities.Film;
import com.cinema.project.entities.Review;

public class UserReview {
    private long id;
    private String filmname;
    private long filmId;
    private String reviewText;
    private int rating;

    public UserReview() {}

    public UserReview(Review review) {
        this.id = review.getId();
        this.filmId = review.getFilm().getId();
        this.filmname = review.getFilm().getName();
        this.reviewText = review.getReviewText();
        this.rating = review.getRating();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getFilmId(){
        return filmId;
    }

    public void setFilmrId(long filmId){
        this.filmId = filmId;
    }

    public String getFilmName(){
        return filmname;
    }

    public void setFilmName(String filmname){
        this.filmname = filmname;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
