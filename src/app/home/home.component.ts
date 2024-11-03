import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { NytimesService } from '../services/nytimes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentDate: string | null;
  categories: string[] = ['home', 'world', 'business', 'arts', 'opinion'];
  selectedCategory: string = 'home';
  isLoading: boolean = false;

  private searchQuery$ = new BehaviorSubject<string>('');

  topMostArticles$: Observable<any[]> | null;
  categoryArticles$: Observable<any[]> | null;
  filteredCategoryArticles$: Observable<any[]>;
  filteredTopMostArticles$: Observable<any[]>;

  // Initial visible items
  visibleCategoryArticles: number = 4;
  visibleTopMostArticles: number = 1;

  constructor(
    private readonly nytimesService: NytimesService,
    private elRef: ElementRef,
    private datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(new Date(), 'EEEE, MMMM d, y');

    // Mendapatkan data artikel dari service
    this.topMostArticles$ = this.nytimesService.topMostArticles$;
    this.categoryArticles$ = this.nytimesService.categoryArticles$;

    // Inisialisasi observables untuk artikel yang sudah difilter
    this.filteredCategoryArticles$ = combineLatest([
      this.categoryArticles$,
      this.searchQuery$,
    ]).pipe(
      map(([articles, query]) =>
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.abstract.toLowerCase().includes(query.toLowerCase())
        )
      )
    );

    this.filteredTopMostArticles$ = combineLatest([
      this.topMostArticles$,
      this.searchQuery$,
    ]).pipe(
      map(([articles, query]) =>
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.abstract.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  ngOnInit(): void {
    this.fetchTopMostNews();
    this.fetchCategoryNews(this.selectedCategory);
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.createScene();
    }
  }

  async fetchTopMostNews(): Promise<void> {
    await this.nytimesService.getTopMostNews();
  }

  async fetchCategoryNews(category: string): Promise<void> {
    this.selectedCategory = category;
    this.isLoading = true;
    await this.nytimesService.getCategoryNews(category);
    this.isLoading = false;
  }

  loadMoreCategoryArticles(): void {
    this.visibleCategoryArticles += 5;
  }

  loadMoreTopMostArticles(): void {
    this.visibleTopMostArticles += 5;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.searchQuery$.next(query);
  }

  createScene(): void {
    const canvasContainer =
      this.elRef.nativeElement.querySelector('#background-canvas');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.02,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
