import bcryptjs from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';
import prisma from '../config/prisma.js';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - Plain text password
 * @param {string} userData.full_name - User full name
 * @param {string} userData.organization_id - Organization ID
 * @returns {Object} Created user with token
 */
export const registerUser = async (userData) => {
  const { email, password, full_name, organization_id } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name,
      organization_id,
      role: 'VIEWER',
    },
    select: {
      id: true,
      email: true,
      full_name: true,
      role: true,
      organization_id: true,
    },
  });

  // Generate JWT token
  const token = generateToken({
    user_id: user.id,
    email: user.email,
    organization_id: user.organization_id,
    role: user.role
  });

  return {
    success: true,
    user,
    token
  };
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Object} User data with token
 */
export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      full_name: true,
      role: true,
      organization_id: true,
      is_active: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_active) {
    throw new Error('User account is inactive');
  }

  // Compare passwords
  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  });

  // Generate JWT token
  const token = generateToken({
    user_id: user.id,
    email: user.email,
    organization_id: user.organization_id,
    role: user.role
  });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      organization_id: user.organization_id
    },
    token
  };
};

/**
 * Verify user token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token data
 */
export const verifyUserToken = (token) => {
  return verifyToken(token);
};

/**
 * Get user by ID
 * @param {number|string} userId - User ID
 * @returns {Object} User data
 */
export const getUserById = async (userId) => {
  const id = Number(userId);

  if (!Number.isInteger(id)) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      full_name: true,
      role: true,
      organization_id: true,
      is_active: true,
      last_login: true,
      created_at: true,
    },
  });
};

/**
 * Update user password
 * @param {number|string} userId - User ID
 * @param {string} currentPassword - Current password (plain text)
 * @param {string} newPassword - New password (plain text)
 * @returns {Object} Success message
 */
export const updatePassword = async (userId, currentPassword, newPassword) => {
  const id = Number(userId);

  if (!Number.isInteger(id)) {
    throw new Error('User not found');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: 'Password updated successfully'
  };
};

/**
 * Refresh JWT token
 * @param {string} token - Current JWT token
 * @returns {string} New JWT token
 */
export const refreshToken = (token) => {
  const decoded = verifyUserToken(token);

  if (!decoded) {
    throw new Error('Invalid or expired token');
  }

  // Generate new token with same payload
  const newToken = generateToken({
    user_id: decoded.user_id,
    email: decoded.email,
    organization_id: decoded.organization_id,
    role: decoded.role
  });

  return newToken;
};
