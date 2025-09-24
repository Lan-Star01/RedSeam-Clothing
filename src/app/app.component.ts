import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidePanelComponent } from "./shared/components/side-panel/side-panel.component";
import { SuccessModalComponent } from "./shared/components/success-modal/success-modal.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidePanelComponent, SuccessModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'redseam-clothing';
}
