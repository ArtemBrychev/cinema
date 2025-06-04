package com.cinema.project.controllers;

import com.cinema.project.entities.Film;
import com.cinema.project.services.SearchService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchController {
    @Autowired
    SearchService searchService;

    @PostMapping("api/search")
    public ResponseEntity<?> getSearchResults(@RequestBody String request){
        if(request.isEmpty()){
            return ResponseEntity.badRequest().body("Поисковой запрос не введен");
        }else{
            return ResponseEntity.ok(searchService.search(request));
        }
    }
}
