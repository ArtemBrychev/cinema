package com.cinema.project.services;

import com.cinema.project.dto.FavouriteResponse;
import com.cinema.project.entities.Favourite;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cinema.project.entities.Film;
import com.cinema.project.entities.User;
import com.cinema.project.repositories.FavouriteRepisitory;
import com.cinema.project.repositories.FilmRepository;
import com.cinema.project.repositories.UserRepository;

@Service
public class FavouriteService {
    
    @Autowired
    FavouriteRepisitory favouriteRepisitory;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FilmRepository filmRepository;

    public ResponseEntity<Object> saveNewFavouriteFilm(long filmId, Principal principal){
        if(!ifLiked(filmId, principal)){
            Film film = filmRepository.findById(filmId).get();
            User user =  userRepository.findByEmail(principal.getName());
            Favourite newFavourite = new Favourite();
            newFavourite.setFilm(film);
            newFavourite.setUser(user);

            favouriteRepisitory.save(newFavourite);
            return ResponseEntity.ok(true);
        }else{
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Фильм уже добавлен в избранное"));
        }
    }

    public List<FavouriteResponse> getListOfFavourite(Principal principal){
        User user =  userRepository.findByEmail(principal.getName());
        List<Favourite> list =  favouriteRepisitory.findByUserId(user.getId());
        List<FavouriteResponse> result = new ArrayList<>();
        for(var x : list){
            Film favFilm = x.getFilm();
            FavouriteResponse favouriteResponse = new FavouriteResponse(x);
            favouriteResponse.setName(favFilm.getName());
            favouriteResponse.setDescription(favFilm.getDescription());
            favouriteResponse.setDirector(favFilm.getDirector());
            System.out.println(favouriteResponse);
            result.add(favouriteResponse);
        }

        return result;

    }

    public Boolean ifLiked(long filmId, Principal principal){
        User user =  userRepository.findByEmail(principal.getName());
        System.out.println("Hello       " + user.getId() + " filmId: " + filmId);
        List<Favourite> list = favouriteRepisitory.findAllByFilmId(filmId);
        for(var x : list){
            System.out.println("    " + x);
            if(x.getUser().getId() == user.getId()){
                return true;
            }
        }
        return false;
    }

    public void deleteLike(long filmId, Principal principal){
        if(ifLiked(filmId, principal)){
            Favourite newFavourite = new Favourite();
            User user =  userRepository.findByEmail(principal.getName());
            List<Favourite> list = favouriteRepisitory.findAllByFilmId(filmId);
            for(var x : list){
            if(x.getUser().getId() == user.getId()){
                newFavourite = x;
            }

            favouriteRepisitory.delete(newFavourite);
        }   
        }
    }
}
