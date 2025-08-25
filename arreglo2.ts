@Override
	public List<Derivados> guardarDerivados(List<DerivadoRequestDTO> requests) {
		// 1. Limpiar la tabla completa
		derivadoRepository.deleteAll();

		// 2. Mapear requests a entidades
		List<Derivados> derivados = new ArrayList<>();

		for (DerivadoRequestDTO data : requests) {
			Derivados derivado = new Derivados();
			derivado.setMonto(BigDecimal.valueOf(data.getExposicion()));
			derivado.setContrato(data.getIdentificacion());
			derivado.setFecha_vcto(data.getFechaOperacion());
			derivado.setFecPeriodo(data.getFechaOperacion());
			derivados.add(derivado);
		}

		// 3. Guardar nuevos
		return derivadoRepository.saveAll(derivados);
	}
