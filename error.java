package com.example.demo.service.impl;

import com.example.demo.dto.DerivadoRequest;
import com.example.demo.model.Derivado;
import com.example.demo.repository.DerivadoRepository;
import com.example.demo.service.DerivadoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DerivadoServiceImpl implements DerivadoService {

    private final DerivadoRepository derivadoRepository;

    public DerivadoServiceImpl(DerivadoRepository derivadoRepository) {
        this.derivadoRepository = derivadoRepository;
    }

    @Override
    public List<Derivado> guardarDerivados(List<DerivadoRequest> requests) {
        // 1. Limpiar la tabla completa
        derivadoRepository.deleteAll();

        // 2. Mapear requests a entidades
        List<Derivado> derivados = requests.stream()
                .map(req -> new Derivado(
                        req.getTipoIdentificacion(),
                        req.getNumeroDocumento(),
                        req.getExposicion(),
                        req.getFecha()
                ))
                .collect(Collectors.toList());

        // 3. Guardar nuevos
        return derivadoRepository.saveAll(derivados);
    }
}
