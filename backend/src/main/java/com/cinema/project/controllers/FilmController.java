package com.cinema.project.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.project.entities.Film;
import com.cinema.project.services.FilmService;

@RestController
public class FilmController {
    
    private final FilmService filmService;

    private int countReq = 0;

    @Autowired
    public FilmController(FilmService filmService){
        this.filmService = filmService;
    }
    
    @GetMapping("api/films")
    public List<Film> getFilm(@RequestParam(required=false) Long categoryId){
        System.out.println("GET api/films");
        if(categoryId == null){
            return filmService.getFilmList();
        }else{
            return filmService.getFilmListByCategory(categoryId);
        }
    }

    @GetMapping("api/films/film/{id}")
    public Film getFilmInfo(@PathVariable long id){
        System.out.println("GET api/films/film/{id}");
        return filmService.getFilmInfo(id);
    }
}
