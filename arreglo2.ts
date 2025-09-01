package com.dehtgemo.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "GEM_TASA_CAMBIO", schema = "DEHTGEMO")
public class GemTasaCambio {

    @Id
    @Column(name = "CDDIVISS", nullable = false, length = 255)
    private String cdDiviss;  // Código divisa

    @Column(name = "CAMBFIX", precision = 38, scale = 2)
    private Double cambFix;   // Tipo de cambio

    @Temporal(TemporalType.DATE)
    @Column(name = "FHCAMBIO")
    private Date fhCambio;   // Fecha de cambio

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TASA_CAMBIO", updatable = false, insertable = false)
    private Long idTasaCambio;  // Identity generado por Oracle

    // Getters y Setters
    public String getCdDiviss() {
        return cdDiviss;
    }

    public void setCdDiviss(String cdDiviss) {
        this.cdDiviss = cdDiviss;
    }

    public Double getCambFix() {
        return cambFix;
    }

    public void setCambFix(Double cambFix) {
        this.cambFix = cambFix;
    }

    public Date getFhCambio() {
        return fhCambio;
    }

    public void setFhCambio(Date fhCambio) {
        this.fhCambio = fhCambio;
    }

    public Long getIdTasaCambio() {
        return idTasaCambio;
    }
}


package com.dehtgemo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dehtgemo.model.GemTasaCambio;

public interface GemTasaCambioRepository extends JpaRepository<GemTasaCambio, String> {
    // JpaRepository ya trae CRUD completo
}


package com.dehtgemo.service;

import com.dehtgemo.model.GemTasaCambio;
import com.dehtgemo.repository.GemTasaCambioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GemTasaCambioService {

    private final GemTasaCambioRepository repository;

    public GemTasaCambioService(GemTasaCambioRepository repository) {
        this.repository = repository;
    }

    public List<GemTasaCambio> findAll() {
        return repository.findAll();
    }

    public Optional<GemTasaCambio> findById(String cdDiviss) {
        return repository.findById(cdDiviss);
    }

    public GemTasaCambio save(GemTasaCambio entity) {
        return repository.save(entity);
    }

    public void deleteById(String cdDiviss) {
        repository.deleteById(cdDiviss);
    }
}



package com.dehtgemo.controller;

import com.dehtgemo.model.GemTasaCambio;
import com.dehtgemo.service.GemTasaCambioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasa-cambio")
public class GemTasaCambioController {

    private final GemTasaCambioService service;

    public GemTasaCambioController(GemTasaCambioService service) {
        this.service = service;
    }

    @GetMapping
    public List<GemTasaCambio> getAll() {
        return service.findAll();
    }

    @GetMapping("/{cdDiviss}")
    public ResponseEntity<GemTasaCambio> getById(@PathVariable String cdDiviss) {
        return service.findById(cdDiviss)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GemTasaCambio create(@RequestBody GemTasaCambio entity) {
        return service.save(entity);
    }

    @PutMapping("/{cdDiviss}")
    public ResponseEntity<GemTasaCambio> update(@PathVariable String cdDiviss, @RequestBody GemTasaCambio entity) {
        if (!service.findById(cdDiviss).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        entity.setCdDiviss(cdDiviss);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{cdDiviss}")
    public ResponseEntity<Void> delete(@PathVariable String cdDiviss) {
        if (!service.findById(cdDiviss).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(cdDiviss);
        return ResponseEntity.noContent().build();
    }
}

