/**
 * Asset Model
 * Define your database schema here
 */

class Asset {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.status = data.status;
    this.purchaseDate = data.purchaseDate;
    this.purchasePrice = data.purchasePrice;
    this.location = data.location;
    this.assignedTo = data.assignedTo;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Add model methods here
  static async findAll() {
    // TODO: Implement database query
  }

  static async findById(id) {
    // TODO: Implement database query
  }

  async save() {
    // TODO: Implement database insert/update
  }

  async delete() {
    // TODO: Implement database delete
  }
}

export default Asset;
