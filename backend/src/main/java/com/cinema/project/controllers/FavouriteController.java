package com.cinema.project.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.project.dto.FavouriteResponse;
import com.cinema.project.services.FavouriteService;

import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;

@RestController
public class FavouriteController {
    @Autowired
    FavouriteService favouriteService;

    @GetMapping("api/likes")
    public List<FavouriteResponse> favouriteList(Principal principal){
        return favouriteService.getListOfFavourite(principal);
    }

    @PostMapping("api/newlike/{id}")
    public ResponseEntity<Object> createNewFavourite(@PathVariable long id, Principal principal){
        return favouriteService.saveNewFavouriteFilm(id, principal);
    }

    @GetMapping("api/check/like/{id}")
    public ResponseEntity<Boolean> isFilmLiked(@PathVariable long id, Principal principal){
        boolean k = favouriteService.ifLiked(id, principal);
        return ResponseEntity.ok(favouriteService.ifLiked(id, principal));
    }

    @DeleteMapping("api/delete/like/{id}")
    public void deleteFavourite(@PathVariable long id, Principal principal){
        favouriteService.deleteLike(id, principal);
    }

}
