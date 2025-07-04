# 🍽️ OurRecipes

A modern recipe sharing and management platform built with **Next.js 13+ App Router** and **JavaScript**. Share your favorite recipes, discover new dishes, and manage your cooking collection with ease.

## 🚀 Features

- **Recipe Management**: Create, view, and organize your recipes
- **Modern UI**: Clean and responsive design with Tailwind CSS
- **API Integration**: RESTful API endpoints for recipe operations
- **Next.js 13+ App Router**: Latest Next.js features with file-based routing
- **JavaScript-First**: Pure JavaScript implementation with JSDoc for type safety
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: JavaScript (ES2017+)
- **Styling**: Tailwind CSS 4.0
- **Runtime**: React 19.0
- **Development**: ESLint for code quality

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/[…nextauth]/route.js         → NextAuth API handler
│   ├── search/
│   │   ├── route.js                      → Search recipes by text or image
│   ├── recipes/
│   │   ├── route.js                      → Create recipe
│   │   ├── [id]/route.js                 → Get/update/delete recipe
│   │   ├── popular/route.js              → Get popular recipes
│   └── categories/route.js               → Get categories
│
├── recipes/
│   ├── [id]/
│   │   └── page.js                       → Recipe detail page
│   └── page.js                           → Recipe listing page
│
├── signin/
│   └── page.js                           → Login page
│
├── dashboard/
│   └── page.js                           → Dashboard with recommendations
│
├── layout.js                             → Root layout
└── page.js                               → Redirect to /dashboard
```

## 🔗 API Endpoints

### Recipes API (`/api/recipes`)

#### GET `/api/recipes`
Retrieve all recipes from the database.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "title": "Delicious Pasta",
      "description": "A simple yet delicious pasta recipe",
      "ingredients": ["pasta", "tomatoes", "garlic"],
      "instructions": ["Boil water", "Cook pasta", "Add sauce"],
      "cookingTime": 30,
      "servings": 4,
      "imageUrl": "https://example.com/image.jpg",
      "author": "John Doe",
      "createdAt": "2025-06-08T10:00:00Z",
      "updatedAt": "2025-06-08T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST `/api/recipes`
Create a new recipe.

**Request Body:**
```json
{
  "title": "New Recipe",
  "description": "Recipe description",
  "ingredients": ["ingredient1", "ingredient2"],
  "instructions": ["step1", "step2"],
  "cookingTime": 45,
  "servings": 6,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "xyz789",
    "title": "New Recipe",
    "description": "Recipe description",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": ["step1", "step2"],
    "cookingTime": 45,
    "servings": 6,
    "imageUrl": "https://example.com/image.jpg",
    "author": "Jane Smith",
    "createdAt": "2025-06-08T11:00:00Z",
    "updatedAt": "2025-06-08T11:00:00Z"
  },
  "message": "Recipe created successfully"
}
```

### Test API (`/api/hello`)

#### GET `/api/hello`
Simple test endpoint to verify API functionality.

**Response:**
```json
{
  "message": "Hello from API route!"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ourrecipes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## 🐳 Docker Support

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### Using Docker Directly

```bash
# Build the image
docker build -t ourrecipes .

# Run the container
docker run -p 3000:3000 ourrecipes
```

## 📝 Development Guidelines

### Code Structure

- **Components**: Place reusable React components in `/components`
- **Pages**: Use Next.js App Router in `/app` directory
- **API Routes**: Create API endpoints in `/app/api`
- **Utilities**: Add helper functions in `/lib`
- **Styles**: Use Tailwind CSS classes, global styles in `/styles`

### Type Safety

This project uses **JSDoc comments** for type definitions instead of TypeScript:

```javascript
/**
 * @typedef {Object} Recipe
 * @property {string} id - Unique identifier
 * @property {string} title - Recipe title
 * @property {string[]} ingredients - List of ingredients
 */

/**
 * Create a new recipe
 * @param {Omit<Recipe, 'id'|'createdAt'|'updatedAt'>} recipeData - Recipe data
 * @returns {Promise<Recipe>} Created recipe
 */
export async function createRecipe(recipeData) {
  // Implementation
}
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `RecipeCard.jsx`)
- **Pages**: lowercase (e.g., `page.js`)
- **API Routes**: lowercase (e.g., `route.js`)
- **Utilities**: camelCase (e.g., `db.js`)

## 🏗️ Architecture

### Deployment Overview

This project is deployed using a modern and scalable architecture:

1. **Docker Hub**: The application is containerized using Docker, ensuring consistent environments across development and production. The Docker image is pushed to Docker Hub for easy distribution.

2. **GitHub Actions**: Continuous Integration and Deployment (CI/CD) pipelines are set up using GitHub Actions. These pipelines automate the process of building Docker images, running tests, and deploying updates.

3. **VPS Deployment**: The application is hosted on a Virtual Private Server (VPS), providing full control over the server environment. Docker Compose is used to manage containers on the VPS.

4. **SSL with Certbot**: Certbot is used to generate and manage SSL certificates, ensuring secure HTTPS connections for the application.

5. **Nginx Reverse Proxy**: Nginx is configured as a reverse proxy to route traffic to the application containers. It also handles SSL termination and provides caching and load balancing capabilities.

### Frontend Structure
```
app/
├── layout.js          # Root layout with metadata and providers
├── page.js            # Homepage with recipe overview
├── about/page.js      # About page
└── recipes/
    ├── page.js        # Recipe listing with search/filter
    └── [id]/page.js   # Individual recipe detail page
```

### API Structure
```
app/api/
├── hello/route.js     # Health check endpoint
└── recipes/route.js   # Recipe CRUD operations
```

### Component Architecture
```
components/
└── RecipeCard.jsx     # Reusable recipe card component
```

## 🔧 Configuration Files

- **`jsconfig.json`**: JavaScript compiler options and path mapping
- **`next.config.mjs`**: Next.js configuration and build settings
- **`eslint.config.mjs`**: ESLint rules and code quality settings
- **`tailwind.config.js`**: Tailwind CSS customization and theme
- **`postcss.config.mjs`**: PostCSS configuration for CSS processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Coding Standards

- Use JavaScript with JSDoc for type annotations
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Recipe rating and reviews
- [ ] Image upload for recipes
- [ ] Recipe categories and tags
- [ ] Search and filtering capabilities
- [ ] Meal planning features
- [ ] Shopping list generation
- [ ] Recipe sharing via social media

---

Built with ❤️ using Next.js and modern web technologies.
