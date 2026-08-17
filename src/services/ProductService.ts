import { db } from '../lib/database';
import { Product } from '../types';

export class ProductService {
  async getProduct(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM products WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) reject(err);
          else if (row) {
            resolve({
              ...row,
              specifications: JSON.parse(row.specifications),
              tags: JSON.parse(row.tags),
              compatibility: JSON.parse(row.compatibility),
              useCases: JSON.parse(row.useCases),
              relatedProducts: JSON.parse(row.relatedProducts)
            });
          } else resolve(null);
        }
      );
    });
  }

  async getProductsByCollection(collection: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM products WHERE collection = ? ORDER BY title',
        [collection],
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows.map(row => ({
              ...row,
              specifications: JSON.parse(row.specifications),
              tags: JSON.parse(row.tags),
              compatibility: JSON.parse(row.compatibility),
              useCases: JSON.parse(row.useCases),
              relatedProducts: JSON.parse(row.relatedProducts)
            })));
          }
        }
      );
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM products 
         WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?
         ORDER BY title`,
        [`%${lowerQuery}%`, `%${lowerQuery}%`, `%${lowerQuery}%`],
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows.map(row => ({
              ...row,
              specifications: JSON.parse(row.specifications),
              tags: JSON.parse(row.tags),
              compatibility: JSON.parse(row.compatibility),
              useCases: JSON.parse(row.useCases),
              relatedProducts: JSON.parse(row.relatedProducts)
            })));
          }
        }
      );
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM products ORDER BY title',
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows.map(row => ({
              ...row,
              specifications: JSON.parse(row.specifications),
              tags: JSON.parse(row.tags),
              compatibility: JSON.parse(row.compatibility),
              useCases: JSON.parse(row.useCases),
              relatedProducts: JSON.parse(row.relatedProducts)
            })));
          }
        }
      );
    });
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => '?').join(',');
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM products WHERE id IN (${placeholders}) ORDER BY title`,
        ids,
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows.map(row => ({
              ...row,
              specifications: JSON.parse(row.specifications),
              tags: JSON.parse(row.tags),
              compatibility: JSON.parse(row.compatibility),
              useCases: JSON.parse(row.useCases),
              relatedProducts: JSON.parse(row.relatedProducts)
            })));
          }
        }
      );
    });
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    const product = await this.getProduct(productId);
    if (!product || !product.relatedProducts) return [];
    return this.getProductsByIds(product.relatedProducts);
  }
}

export default new ProductService();
