<div class="container">
  <div class="row">
    <div class="col-10 mx-auto">
      <div class="container py-5">
        <div class="row pb-2 align-items-center">
          <div class="col">
            <h1>Carga Ficha Técnica</h1>
          </div>
        </div>
        <div class="row">
          <div
          *ngIf="penomperDependencia;
            then thenBlock;
            else elseBlock
          "
        ></div>
        <ng-template #thenBlock>
          <h3>Para el cliente {{penomperDependencia}} (<i>{{petipdocDependencia}}-{{penumdocDependencia}}</i>)</h3>
        </ng-template>
        <ng-template #elseBlock>
          <p>Carga tipo Excel, el cual contiene la información pertinente de los clientes interconectados:</p>
        </ng-template>
          
        </div>
        <!-- render the fact sheet upload form -->
        <div *ngIf="oldFactSheet.idFichaTecnica===-1; else oldFactSheetLoaded" class="drag-drop-area" (drop)="onDrop($event)"
          (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)">
          <div class="file-upload pt-4">
            <input type="file" (change)="onFileSelected($event)" accept=".xlsx" hidden #fileInput>
            <div class="text-center">
              <p>Por favor, selecciona un archivo Excel válido (.xlsx) de hasta 10MB.</p>
            </div>
            <app-request-button (click)="fileInput.click()" [isLoading]="isLoadingFile" [disabled]="disabled"
              icon="upload-cloud">Seleccionar archivo</app-request-button>
            <div class="text-center">
              <small>Arrastra tu archivo aquí</small>
            </div>
          </div>
        </div>
        <!-- render the fact sheet info -->
        <ng-template #oldFactSheetLoaded>
          <div class="row">
            <div class="col">
              <app-fact-sheet-relationships [factSheet]="oldFactSheet" [new]="false">
              </app-fact-sheet-relationships>
            </div>
            <div class="col">
              <app-fact-sheet-relationships [factSheet]="newFactSheet" [new]="true">
              </app-fact-sheet-relationships>
            </div>
          </div>
          <div class="row my-4 justify-content-center">
            <div class="col-auto">
              <button type="button" color="primary" class="d-flex rounded-pill" mat-stroked-button (click)="reset()">
                <mat-icon svgIcon="close"></mat-icon>
                Cancelar cambios
              </button>
            </div>
            <div class="col-auto">
              <app-request-button (click)="storeNewFactSheet()" [isLoading]="storeNewFactSheetIsLoading"
                [disabled]="storeNewFactSheetDisabled" icon="upload-cloud">
                Guardar ficha técnica
              </app-request-button>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  </div>
</div>
