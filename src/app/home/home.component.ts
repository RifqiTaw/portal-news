import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { NytimesService } from '../services/nytimes.service';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  categories: string[] = ['home', 'world', 'business', 'arts', 'opinion'];
  selectedCategory: string = 'home';
  isLoading: boolean = false;

  // Initial visible items
  visibleCategoryArticles: number = 4;
  visibleTopMostArticles: number = 1;

  // Observables
  topMostArticles$;
  categoryArticles$;

  constructor(
    private readonly nytimesService: NytimesService,
    private elRef: ElementRef
  ) {
    this.topMostArticles$ = this.nytimesService.topMostArticles$;
    this.categoryArticles$ = this.nytimesService.categoryArticles$;
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

  fetchTopMostNews(): void {
    this.nytimesService.getTopMostNews();
  }

  fetchCategoryNews(category: string): void {
    this.selectedCategory = category;
    this.isLoading = true;
    this.nytimesService.getCategoryNews(category);
    this.nytimesService.categoryArticles$.subscribe(() => {
      this.isLoading = false;
    });
  }

  loadMoreCategoryArticles(): void {
    this.visibleCategoryArticles += 5;
  }

  loadMoreTopMostArticles(): void {
    this.visibleTopMostArticles += 5;
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
