package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.EventService;
import com.example.project_management_class.domain.model.Event;
import com.example.project_management_class.domain.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;

    @Override
    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event getEventById(String id) {
        return eventRepository.findById(id).orElse(null);
    }

    @Override
    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }

    @Override
    public List<Event> getActiveEvents() {
        return eventRepository.findByIsActiveTrueOrderByDateAsc();
    }

    @Override
    public List<Event> getEventsByType(String eventType) {
        return eventRepository.findByEventTypeAndIsActiveTrueOrderByDateAsc(eventType);
    }
    @Override
    public List<Event> getEventsByAudiences(List<String> audiences) {
        return eventRepository.findByTargetAudienceInAndIsActiveTrueOrderByDateAsc(audiences);
    }
}
