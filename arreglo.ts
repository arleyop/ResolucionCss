@Id
    @Column(name = "fec_periodo", nullable = false)
  	private LocalDate fecPeriodo;

    @Id
    @Column(name = "contrato", length = 20, nullable = false)
    private String contrato;

    @Column(name = "monto", precision = 17, scale = 4)
    private BigDecimal monto;
    
    @OneToMany (mappedBy = "derivados")
    private Set<ReClientesObligacion> reClienteObligacion;
    
    @OneToMany(mappedBy = "derivados")
   	private Set<RePrestamosGarantias> prestamosGarantias ;
    
    @Column(name = "FECHA_VCTO")
    private LocalDate fecha_vcto;





package com.santander.bnc.bsn021.bncbsn021gemotorbackend.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.santander.bnc.bsn021.bncbsn021gemotorbackend.dto.DerivadoRequestDTO;
import com.santander.bnc.bsn021.bncbsn021gemotorbackend.model.motor.Derivados;
import com.santander.bnc.bsn021.bncbsn021gemotorbackend.repository.motor.DerivadosRepository;
import com.santander.bnc.bsn021.bncbsn021gemotorbackend.service.DerivadoService;
import com.santander.bnc.bsn021.bncbsn021gemotorbackend.service.MonitoreoService;
import com.santander.bnc.bsn021.bncbsn021gemotorbackend.utils.ConstantsUtil;

@Service
public class DerivadoServiceImpl implements DerivadoService {

	@Autowired
	private DerivadosRepository derivadoRepository;
	
	@Autowired
	private MonitoreoService monitoreoService;
	

	@Override
	public List<Derivados> guardarDerivados(List<DerivadoRequestDTO> requests) throws Exception {
		// 1. Limpiar la tabla completa
		try {
		derivadoRepository.deleteAll();
		} catch (Exception e) {
			throw new Exception("Error al borrar Derivados", e);
		}
		// 2. Mapear requests a entidades
		List<Derivados> derivados = new ArrayList<>();

		for (DerivadoRequestDTO data : requests) {
			Derivados derivado = new Derivados();
			derivado.setMonto(BigDecimal.valueOf(data.getExposicion()));
			derivado.setContrato(data.getTipoIdentificacion());
			derivado.setFecha_vcto(data.getFechaOperacion());
			derivado.setFecPeriodo(data.getFechaOperacion());
			derivados.add(derivado);
		}
		try {
		
		monitoreoService.registrarAccionMonitoreo(ConstantsUtil.PROCESOS_CARGA_ACCION_GUARDAR, ConstantsUtil.MODULO_PROCESOS_CARGA_DERIVADOS);
		
		// 3. Guardar nuevos
		return derivadoRepository.saveAll(derivados);
		
		} catch (Exception e) {
			throw new Exception("Error al Guardar Derivados", e);
		}
		
	}

}
