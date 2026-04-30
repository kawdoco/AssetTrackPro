export const paths = {
  '/': {
    get: {
      tags: ['Health'],
      summary: 'API health check',
      responses: {
        200: {
          description: 'Service is available.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'AssetTrackPro API v1' },
                  online: { type: 'boolean', example: true }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AuthRegisterRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthSuccessResponse' }
            }
          }
        },
        400: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Authenticate user and return tokens',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AuthLoginRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Authenticated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthSuccessResponse' }
            }
          }
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Token refreshed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                }
              }
            }
          }
        },
        401: {
          description: 'Invalid or missing token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Invalidate current refresh token',
      responses: {
        200: {
          description: 'Logged out successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Logged out successfully' }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get current authenticated user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Current user details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  user: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        },
        401: {
          description: 'Not authenticated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/auth/change-password': {
    post: {
      tags: ['Auth'],
      summary: 'Change authenticated user password',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AuthChangePasswordRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Password changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Password changed successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Password change failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/assets': {
    get: {
      tags: ['Assets'],
      summary: 'List assets',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by asset status' },
        { name: 'asset_type', in: 'query', schema: { type: 'string' }, description: 'Filter by asset type' },
        { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by tag UID, serial number, or model' }
      ],
      responses: {
        200: {
          description: 'Assets list',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Asset' } }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Assets'],
      summary: 'Create asset',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AssetCreateRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Asset created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Asset created successfully' },
                  data: { $ref: '#/components/schemas/Asset' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid payload',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Duplicate asset tag UID',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/assets/{id}': {
    get: {
      tags: ['Assets'],
      summary: 'Get asset by id',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Asset ID' }
      ],
      responses: {
        200: {
          description: 'Asset detail',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Asset' }
                }
              }
            }
          }
        },
        404: {
          description: 'Asset not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    put: {
      tags: ['Assets'],
      summary: 'Update asset by id',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Asset ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AssetUpdateRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Asset updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Asset updated successfully' },
                  data: { $ref: '#/components/schemas/Asset' }
                }
              }
            }
          }
        },
        404: {
          description: 'Asset not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Assets'],
      summary: 'Delete asset by id',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Asset ID' }
      ],
      responses: {
        200: {
          description: 'Asset deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Asset deleted successfully' }
                }
              }
            }
          }
        },
        404: {
          description: 'Asset not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/organizations': {
    get: {
      tags: ['Organizations'],
      summary: 'Get organizations with pagination and filters',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Records per page' },
        { name: 'search', in: 'query', schema: { type: 'string', default: '' }, description: 'Search by organization name' },
        { name: 'includeInactive', in: 'query', schema: { type: 'boolean', default: false }, description: 'Include inactive organizations' }
      ],
      responses: {
        200: {
          description: 'Organizations list',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Organization' } },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 24 },
                      totalPages: { type: 'integer', example: 3 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Organizations'],
      summary: 'Create a new organization',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/OrganizationCreateRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Organization created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Organization' },
                  message: { type: 'string', example: 'Organization created successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid payload',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/organizations/{id}': {
    get: {
      tags: ['Organizations'],
      summary: 'Get organization by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Organization ID' }
      ],
      responses: {
        200: {
          description: 'Organization details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    allOf: [{ $ref: '#/components/schemas/Organization' }],
                    properties: {
                      branches: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/OrganizationBranchSummary' }
                      },
                      _count: { $ref: '#/components/schemas/OrganizationCountSummary' }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Organization not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    put: {
      tags: ['Organizations'],
      summary: 'Update organization',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Organization ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/OrganizationUpdateRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Organization updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Organization' },
                  message: { type: 'string', example: 'Organization updated successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid payload',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: {
          description: 'Organization not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Organizations'],
      summary: 'Deactivate organization',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Organization ID' }
      ],
      responses: {
        200: {
          description: 'Organization deactivated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Organization' },
                  message: { type: 'string', example: 'Organization "Default Organization" has been deactivated' }
                }
              }
            }
          }
        },
        404: {
          description: 'Organization not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/organizations/{id}/reactivate': {
    patch: {
      tags: ['Organizations'],
      summary: 'Reactivate organization',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Organization ID' }
      ],
      responses: {
        200: {
          description: 'Organization reactivated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Organization' },
                  message: { type: 'string', example: 'Organization "Default Organization" has been reactivated' }
                }
              }
            }
          }
        },
        404: {
          description: 'Organization not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/branches': {
    get: {
      tags: ['Branches'],
      summary: 'Get branches with pagination and filters',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Records per page' },
        { name: 'search', in: 'query', schema: { type: 'string', default: '' }, description: 'Search by branch name or city' },
        { name: 'organization_id', in: 'query', schema: { type: 'integer', nullable: true }, description: 'Filter by organization ID' },
        { name: 'includeInactive', in: 'query', schema: { type: 'boolean', default: false }, description: 'Include inactive branches' }
      ],
      responses: {
        200: {
          description: 'Branches list',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Branch' } },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 24 },
                      totalPages: { type: 'integer', example: 3 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Branches'],
      summary: 'Create a new branch',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BranchCreateRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Branch created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Branch' },
                  message: { type: 'string', example: 'Branch created successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid payload',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/branches/{id}': {
    get: {
      tags: ['Branches'],
      summary: 'Get branch by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Branch ID' }
      ],
      responses: {
        200: {
          description: 'Branch details',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/BranchDetail' }
                }
              }
            }
          }
        },
        404: {
          description: 'Branch not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    put: {
      tags: ['Branches'],
      summary: 'Update branch',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Branch ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BranchUpdateRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Branch updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Branch' },
                  message: { type: 'string', example: 'Branch updated successfully' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid payload',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: {
          description: 'Branch not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Branches'],
      summary: 'Deactivate branch',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Branch ID' }
      ],
      responses: {
        200: {
          description: 'Branch deactivated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Branch' },
                  message: { type: 'string', example: 'Branch deactivated successfully' }
                }
              }
            }
          }
        },
        404: {
          description: 'Branch not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/branches/{id}/reactivate': {
    patch: {
      tags: ['Branches'],
      summary: 'Reactivate branch',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Branch ID' }
      ],
      responses: {
        200: {
          description: 'Branch reactivated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/Branch' },
                  message: { type: 'string', example: 'Branch reactivated successfully' }
                }
              }
            }
          }
        },
        404: {
          description: 'Branch not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/employees/organizations': {
    get: {
      tags: ['Employees'],
      summary: 'Get organizations available for employee creation',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Organization list',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/EmployeeOrganizationSummary' } }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/employees': {
    get: {
      tags: ['Employees'],
      summary: 'Get employees',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'organization_id', in: 'query', schema: { type: 'integer' }, description: 'Filter by organization ID' },
        { name: 'search', in: 'query', schema: { type: 'string', default: '' }, description: 'Search by name, employee code, or email' },
        { name: 'is_active', in: 'query', schema: { type: 'boolean' }, description: 'Filter by active state' }
      ],
      responses: {
        200: {
          description: 'Employees list',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'array', items: { $ref: '#/components/schemas/Employee' } }
                }
              }
            }
          }
        }
      }
    }
  },
  '/api/employees/create': {
    post: {
      tags: ['Employees'],
      summary: 'Create employee',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EmployeeCreateRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Employee created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Employee created successfully' },
                  data: { $ref: '#/components/schemas/Employee' }
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid payload',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Duplicate employee code',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/employees/{id}': {
    put: {
      tags: ['Employees'],
      summary: 'Update employee',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Employee ID' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EmployeeUpdateRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Employee updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Employee updated successfully' },
                  data: { $ref: '#/components/schemas/Employee' }
                }
              }
            }
          }
        },
        404: {
          description: 'Employee not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Duplicate employee code',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Employees'],
      summary: 'Deactivate employee',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Employee ID' }
      ],
      responses: {
        200: {
          description: 'Employee deactivated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Employee deactivated successfully' },
                  data: { $ref: '#/components/schemas/Employee' }
                }
              }
            }
          }
        },
        404: {
          description: 'Employee not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  }
};