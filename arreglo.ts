	@Override
	public Map<String, Object> findAll() {

		Map<String, Object> response = new HashMap<>();
		try {
			List<GemTasaCambio> listGemTasaCambios = this.gemTasaCambioRepository.findAll();
			List<GemTasaCambioDTO> lista = new ArrayList<>();

			if (!listGemTasaCambios.isEmpty()) {
				for (GemTasaCambio dataRegistro : listGemTasaCambios) {
					GemTasaCambioDTO cambioDTO = new GemTasaCambioDTO();
					cambioDTO.setCambFix(dataRegistro.getCambfix().doubleValue());
					cambioDTO.setCdDiviss(dataRegistro.getCodDivisa());
					cambioDTO.setFhCambio(dataRegistro.getFhcambio());
					lista.add(cambioDTO);
				}
			}
			response.put(ConstantsUtil.STATUS, ConstantsUtil.SUCCESS);
			response.put(ConstantsUtil.DATA, lista);
		} catch (Exception e) {
			response.put(ConstantsUtil.STATUS, ConstantsUtil.ERROR);
			response.put(ConstantsUtil.MESSAGE,
					"Ha ocurrido un error, en servidor API" + "\nError: "
							+ (e != null && "Ha ocurrido un error, en servidor API" != null
									? "Ha ocurrido un error, en servidor API"
									: e.toString()));
		}

		return response;
	}


@RestController
@RequestMapping("/api/tasas-cambio")
public class TasaCambioController {
	
	@Autowired
	private GemTasaCambioServiceImpl tasaCambioServiceImpl;

	@GetMapping("/tipos-moneda")
	public Map<String, Object> getAllParametriaMoneda() {
		return tasaCambioServiceImpl.findAll();
	}



