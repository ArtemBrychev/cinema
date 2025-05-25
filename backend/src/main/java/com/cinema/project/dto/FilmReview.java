package com.cinema.project.dto;

import java.time.LocalDate;

import com.cinema.project.entities.Review;
import com.cinema.project.entities.User;

public class FilmReview {
    private long id;
    private String username;
    private long userId;
    private String reviewText;
    private int rating;
    private LocalDate reviewDate;

    public FilmReview() {}

    public FilmReview(Review review) {
        this.id = review.getId();
        this.username = review.getUser().getName();
        this.userId = review.getUser().getId();
        this.reviewText = review.getReviewText();
        this.rating = review.getRating();
        this.reviewDate = review.getReviewDate();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserId(){
        return userId;
    }

    public void setUserId(long userId){
        this.userId = userId;
    }

    public String getUserName(){
        return username;
    }

    public void setUserName(String username){
        this.username = username;
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

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    @Override
    public String toString(){
        return "Review of user(" + username + 
            ") to film: " + " unknown " + ". " + 
            "Rating: " + rating + " content: " +
            reviewText + " at " + reviewDate;
    }
}
