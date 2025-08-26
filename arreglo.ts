@OneToMany(mappedBy = "derivados", cascade = CascadeType.ALL, orphanRemoval = true)
private Set<ReClientesObligacion> reClienteObligacion;

@OneToMany(mappedBy = "derivados", cascade = CascadeType.ALL, orphanRemoval = true)
private Set<RePrestamosGarantias> prestamosGarantias;
