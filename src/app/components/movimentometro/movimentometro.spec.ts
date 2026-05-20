import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Movimentometro } from './movimentometro';

describe('Movimentometro', () => {
  let component: Movimentometro;
  let fixture: ComponentFixture<Movimentometro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movimentometro],
    }).compileComponents();

    fixture = TestBed.createComponent(Movimentometro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
