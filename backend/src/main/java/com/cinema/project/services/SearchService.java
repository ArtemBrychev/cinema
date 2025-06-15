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
        String[] dataWords = prapareString(searchRequest).split(" ");
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

    private String prapareString(String original){
        return original.replaceAll("[^a-zA-Zа-яА-ЯёЁ0-9\\s]", "")
                .replaceAll("\\s+", " ")
                .trim()
                .toLowerCase()
                .replace("ё", "е")
                .replace("э", "е")
                .replace("ъ", "ь");
    }

    private Double calculateRate(Film film, String[] keywords) {
        if (keywords.length == 0) return 0.0;
    
        String filmName = prapareString(film.getName());
    
        String filmDescription = prapareString(film.getDescription());
    
        int totalNamePoints = 0, totalDescPoints = 0;
    
        for (String keyword : keywords) {
            String lowerKeyword = keyword.toLowerCase();
            if (filmName.contains(lowerKeyword)) {
                totalNamePoints += 5;
            }else if(filmName.contains(enToRu(lowerKeyword))){
                totalNamePoints += 5;
            }
            
            if (filmDescription.contains(lowerKeyword)) {
                totalDescPoints += 1;
            }else if(filmDescription.contains(enToRu(lowerKeyword))){
                totalDescPoints += 1;
            }
        }
    
        
        double maxPossibleScore = (5 + 1) * keywords.length;
        double actualScore = totalNamePoints + totalDescPoints;
        
        return actualScore / maxPossibleScore;
    }

    private String enToRu(String original) {
        Map<Character, Character> enToRuMap = new HashMap<>();
        enToRuMap.put('q', 'й');
        enToRuMap.put('w', 'ц');
        enToRuMap.put('e', 'у');
        enToRuMap.put('r', 'к');
        enToRuMap.put('t', 'е');
        enToRuMap.put('y', 'н');
        enToRuMap.put('u', 'г');
        enToRuMap.put('i', 'ш');
        enToRuMap.put('o', 'щ');
        enToRuMap.put('p', 'з');
        enToRuMap.put('[', 'х');
        enToRuMap.put(']', 'ъ');
        enToRuMap.put('a', 'ф');
        enToRuMap.put('s', 'ы');
        enToRuMap.put('d', 'в');
        enToRuMap.put('f', 'а');
        enToRuMap.put('g', 'п');
        enToRuMap.put('h', 'р');
        enToRuMap.put('j', 'о');
        enToRuMap.put('k', 'л');
        enToRuMap.put('l', 'д');
        enToRuMap.put(';', 'ж');
        enToRuMap.put('\'', 'э');
        enToRuMap.put('z', 'я');
        enToRuMap.put('x', 'ч');
        enToRuMap.put('c', 'с');
        enToRuMap.put('v', 'м');
        enToRuMap.put('b', 'и');
        enToRuMap.put('n', 'т');
        enToRuMap.put('m', 'ь');
        enToRuMap.put(',', 'б');
        enToRuMap.put('.', 'ю');

        StringBuilder result = new StringBuilder();
        for (char c : original.toCharArray()) {
            result.append(enToRuMap.getOrDefault(c, c));
        }
        return result.toString();
    }
}
