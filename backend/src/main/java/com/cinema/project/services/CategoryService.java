package com.cinema.project.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.project.entities.*;
import com.cinema.project.repositories.CategoryRepository;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getCategoryList(){
        return categoryRepository.findAll();
    }
}
