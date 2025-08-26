/**
 * Verifica si el formulario de patrimonio es válido
 */
getSaveButtonEnabledPatrimonio(): boolean {
  return this.parametriaPatrimonioFormGroup.valid;
}

/**
 * Guardar patrimonio (crear o actualizar)
 */
onSaveButtonClickedPatrimonio() {
  if (!this.getSaveButtonEnabledPatrimonio()) {
    return;
  }

  const patrimonio: ParametriaPatrimonio = this.parametriaPatrimonioFormGroup.value;

  // Si es nuevo (idPatrimonio = -1 o null) → crear
  if (patrimonio.idPatrimonio === -1 || patrimonio.idPatrimonio == null) {
    this.createParametriaPatrimonio(patrimonio);
  } else {
    this.updateParametriaPatrimonio(patrimonio);
  }
}

/**
 * Crear patrimonio
 */
createParametriaPatrimonio(patrimonio: ParametriaPatrimonio) {
  this.isFormLoading = true;
  this.parametriaPatriminioService.createParametriaPatrimonio(patrimonio).subscribe({
    next: () => {
      this.updateTableDataSourcePatrimonio();
      swal('Patrimonio creado', 'El patrimonio ha sido creado correctamente.', 'success');
      this.parametriaPatrimonioFormGroup.reset();
    },
    error: (error) => {
      swal('Error al crear el patrimonio', error, 'error');
      this.isFormLoading = false;
    },
    complete: () => {
      this.isFormLoading = false;
    }
  });
}

/**
 * Actualizar patrimonio
 */
updateParametriaPatrimonio(patrimonio: ParametriaPatrimonio) {
  this.isFormLoading = true;
  this.parametriaPatriminioService.updateParametriaPatrimonio(patrimonio).subscribe({
    next: () => {
      this.updateTableDataSourcePatrimonio();
      swal('Patrimonio actualizado', 'El patrimonio ha sido actualizado correctamente.', 'success');
    },
    error: (error) => {
      swal('Error al actualizar el patrimonio', error, 'error');
      this.isFormLoading = false;
    },
    complete: () => {
      this.isFormLoading = false;
    }
  });
}
