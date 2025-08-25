
@RestController
@RequestMapping("/api/derivados")
public class DerivadoController {

    private final DerivadoService derivadoService;

    public DerivadoController(DerivadoService derivadoService) {
        this.derivadoService = derivadoService;
    }

    @PostMapping("/guardar")
    public ResponseEntity<List<Derivado>> guardarDerivados(@RequestBody List<DerivadoRequest> requests) {
        List<Derivado> guardados = derivadoService.guardarDerivados(requests);
        return ResponseEntity.ok(guardados);
    }
