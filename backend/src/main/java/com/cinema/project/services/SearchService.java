package com.cinema.project.services;

import com.cinema.project.entities.Film;
import com.cinema.project.repositories.FilmRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchService {
    
    @Autowired
    private FilmService filmService;

    public List<Film> search(String searchRequest){
        String[] dataWords = prepareData(searchRequest);
        List<Film> filmArr = filmService.getFilmList();
        HashMap<Film, Double> filmRates= new HashMap<>();
        for(int i = 0; i < filmArr.size(); i++){
            Double rate = calculateRate(filmArr.get(i), dataWords);
            if(rate >= 0.15){
                filmRates.put(filmArr.get(i), rate);
            }
        }

        List<Film> sortedFilms = filmRates.entrySet().stream()
        .sorted(Map.Entry.<Film, Double>comparingByValue().reversed())
        .map(Map.Entry::getKey)
        .collect(Collectors.toList());

        return sortedFilms;
    }


    private String[] prepareData(String data){
        String result = data.replaceAll("[^a-zA-Zа-яА-ЯёЁ0-9\\s]", "");
        result = result.replaceAll("\\s+", " ").trim()
            .replace("ё", "е")
            .replace("э", "е")
            .replace("ъ", "ь");

        return result.split(" ");
    }

    private Double calculateRate(Film film, String[] keywords) {
        if (keywords.length == 0) return 0.0;
    
        String filmName = film.getName()
            .replaceAll("[^a-zA-Zа-яА-ЯёЁ0-9\\s]", "")
            .replaceAll("\\s+", " ")
            .trim()
            .toLowerCase()
            .replace("ё", "е")
            .replace("э", "е")
            .replace("ъ", "ь");
    
        String filmDescription = film.getDescription()
            .replaceAll("[^a-zA-Zа-яА-ЯёЁ0-9\\s]", "")
            .replaceAll("\\s+", " ")
            .trim()
            .toLowerCase()
            .replace("ё", "е")
            .replace("э", "е")
            .replace("ъ", "ь");
    
        int totalNamePoints = 0, totalDescPoints = 0;
    
        for (String keyword : keywords) {
            String lowerKeyword = keyword.toLowerCase();
            if (filmName.contains(lowerKeyword)) {
                totalNamePoints += 5;
            }
            
            if (filmDescription.contains(lowerKeyword)) {
                totalDescPoints += 1;
            }
        }
    
        
        double maxPossibleScore = (5 + 1) * keywords.length;
        double actualScore = totalNamePoints + totalDescPoints;
        
        return actualScore / maxPossibleScore;
    }
}
