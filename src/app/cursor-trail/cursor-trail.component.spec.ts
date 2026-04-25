import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorTrailComponent } from './cursor-trail.component';

describe('CursorTrailComponent', () => {
  let component: CursorTrailComponent;
  let fixture: ComponentFixture<CursorTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursorTrailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursorTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
