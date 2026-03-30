package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Event;
import java.util.List;

public interface EventService {
    Event addEvent(Event event);
    List<Event> getAllEvents();
    Event getEventById(String id);
    Event updateEvent(Event event);
    void deleteEvent(String id);
    List<Event> getActiveEvents();
    List<Event> getEventsByType(String eventType);
    List<Event> getEventsByAudience(String targetAudience);
    List<Event> getEventsByAudiences(List<String> audiences);
}
