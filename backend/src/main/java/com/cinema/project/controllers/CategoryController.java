package com.cinema.project.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.project.entities.Category;
import com.cinema.project.services.CategoryService;

@RestController
public class CategoryController {
    private CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping("api/categories")
    public List<Category> getCategories(){
        System.out.println("GET api/categories");
        return categoryService.getCategoryList();
    }
    
}
