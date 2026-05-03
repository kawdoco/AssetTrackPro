export const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  schemas: {
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Validation failed' }
      }
    },
    User: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        email: { type: 'string', format: 'email', example: 'admin@assettrackpro.local' },
        full_name: { type: 'string', example: 'System Administrator' },
        role: { type: 'string', example: 'ADMIN' },
        organization_id: { type: 'integer', nullable: true, example: 1 },
        is_active: { type: 'boolean', example: true },
        last_login: { type: 'string', format: 'date-time', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    },
    AuthRegisterRequest: {
      type: 'object',
      required: ['email', 'password', 'full_name', 'organization_id'],
      properties: {
        email: { type: 'string', format: 'email', example: 'manager@assettrackpro.local' },
        password: { type: 'string', minLength: 6, example: 'Admin@123' },
        full_name: { type: 'string', example: 'Operations Manager' },
        organization_id: { type: 'integer', example: 1 }
      }
    },
    AuthLoginRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'admin@assettrackpro.local' },
        password: { type: 'string', example: 'Admin@123' }
      }
    },
    AuthChangePasswordRequest: {
      type: 'object',
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: { type: 'string', example: 'Admin@123' },
        newPassword: { type: 'string', minLength: 6, example: 'Admin@1234' }
      }
    },
    AuthSuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation completed successfully' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: { $ref: '#/components/schemas/User' }
      }
    },
    ZoneSummary: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 4 },
        zone_name: { type: 'string', example: 'Zone A' },
        zone_type: { type: 'string', nullable: true, example: 'STORAGE' }
      }
    },
    Asset: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 15 },
        organization_id: { type: 'integer', example: 1 },
        asset_tag_uid: { type: 'string', example: 'RF-8829' },
        asset_type: { type: 'string', example: 'LAPTOP' },
        model: { type: 'string', nullable: true, example: 'Dell Latitude 7420' },
        serial_number: { type: 'string', nullable: true, example: 'SN-123456' },
        status: { type: 'string', example: 'ACTIVE' },
        last_seen_zone_id: { type: 'integer', nullable: true, example: 4 },
        last_seen_time: { type: 'string', format: 'date-time', nullable: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        last_seen_zone: {
          allOf: [{ $ref: '#/components/schemas/ZoneSummary' }],
          nullable: true
        }
      }
    },
    AssetCreateRequest: {
      type: 'object',
      required: ['asset_tag_uid', 'asset_type'],
      properties: {
        asset_tag_uid: { type: 'string', example: 'RF-8829' },
        asset_type: { type: 'string', example: 'LAPTOP' },
        model: { type: 'string', nullable: true, example: 'Dell Latitude 7420' },
        serial_number: { type: 'string', nullable: true, example: 'SN-123456' },
        status: { type: 'string', example: 'ACTIVE' },
        last_seen_zone_id: { type: 'integer', nullable: true, example: 4 },
        last_seen_time: { type: 'string', format: 'date-time', nullable: true, example: '2026-04-29T10:30:00.000Z' }
      }
    },
    AssetUpdateRequest: {
      type: 'object',
      properties: {
        asset_tag_uid: { type: 'string', example: 'RF-8829' },
        asset_type: { type: 'string', example: 'TABLET' },
        model: { type: 'string', nullable: true, example: 'iPad Pro' },
        serial_number: { type: 'string', nullable: true, example: 'SN-123456' },
        status: { type: 'string', example: 'ACTIVE' },
        last_seen_zone_id: { type: 'integer', nullable: true, example: 5 },
        last_seen_time: { type: 'string', format: 'date-time', nullable: true, example: '2026-04-29T10:30:00.000Z' }
      }
    },
    MovementEvent: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 101 },
        asset_id: { type: 'integer', example: 15 },
        gate_id: { type: 'integer', example: 5 },
        zone_from_id: { type: 'integer', nullable: true, example: 4 },
        zone_to_id: { type: 'integer', example: 7 },
        event_type: { type: 'string', example: 'ENTER' },
        event_time: { type: 'string', format: 'date-time' },
        trigger_source: { type: 'string', example: 'RFID' },
        signal_strength: { type: 'integer', nullable: true, example: -65 },
        created_at: { type: 'string', format: 'date-time' },
        asset: { $ref: '#/components/schemas/Asset' },
        gate: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            gate_name: { type: 'string', example: 'North Gate' },
            zone_id: { type: 'integer', example: 7 },
            direction: { type: 'string', example: 'BOTH' }
          }
        },
        zone_from: { allOf: [{ $ref: '#/components/schemas/ZoneSummary' }], nullable: true },
        zone_to: { $ref: '#/components/schemas/ZoneSummary' }
      }
    },
    MovementEventWebhookRequest: {
      type: 'object',
      required: ['organization_id'],
      properties: {
        organization_id: { type: 'integer', example: 1 },
        tag_epc: { type: 'string', example: '3066412B5FA9F46D01000000' },
        gate_id: { type: 'integer', example: 5 },
        reader_id: { type: 'string', example: 'reader-01' },
        rssi: { type: 'integer', example: -65 },
        timestamp: { type: 'string', format: 'date-time', example: '2026-05-03T10:34:22Z' },
        event_type: { type: 'string', example: 'ENTER' },
        trigger_source: { type: 'string', example: 'RFID' }
      }
    },
    Organization: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Default Organization' },
        industry_type: { type: 'string', nullable: true, example: 'Logistics' },
        is_active: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    },
    OrganizationCountSummary: {
      type: 'object',
      properties: {
        branches: { type: 'integer', example: 3 },
        employees: { type: 'integer', example: 25 },
        assets: { type: 'integer', example: 110 }
      }
    },
    OrganizationBranchSummary: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 4 },
        name: { type: 'string', example: 'HQ Branch' },
        city: { type: 'string', example: 'Singapore' },
        status: { type: 'string', example: 'ACTIVE' },
        created_at: { type: 'string', format: 'date-time' }
      }
    },
    OrganizationCreateRequest: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', example: 'Acme Logistics' },
        industry_type: { type: 'string', nullable: true, example: 'Logistics' }
      }
    },
    OrganizationUpdateRequest: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', example: 'Acme Logistics Global' },
        industry_type: { type: 'string', nullable: true, example: 'Supply Chain' }
      }
    },
    BranchOrganizationSummary: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Default Organization' }
      }
    },
    BranchBuildingSummary: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 12 },
        name: { type: 'string', example: 'Warehouse 12' },
        zone_count: { type: 'integer', example: 4 }
      }
    },
    Branch: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 4 },
        organization_id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'HQ Branch' },
        city: { type: 'string', example: 'Singapore' },
        status: { type: 'string', example: 'ACTIVE' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        organization: { $ref: '#/components/schemas/BranchOrganizationSummary' },
        _count: {
          type: 'object',
          properties: {
            buildings: { type: 'integer', example: 3 }
          }
        }
      }
    },
    BranchCreateRequest: {
      type: 'object',
      required: ['organization_id', 'name', 'city'],
      properties: {
        organization_id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'HQ Branch' },
        city: { type: 'string', example: 'Singapore' }
      }
    },
    BranchUpdateRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'HQ Branch' },
        city: { type: 'string', example: 'Singapore' },
        status: { type: 'string', example: 'ACTIVE' }
      }
    },
    BranchDetail: {
      allOf: [{ $ref: '#/components/schemas/Branch' }],
      properties: {
        buildings: {
          type: 'array',
          items: { $ref: '#/components/schemas/BranchBuildingSummary' }
        }
      }
    },
    Building: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 12 },
        branch_id: { type: 'integer', example: 4 },
        name: { type: 'string', example: 'Warehouse 12' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        branch: { $ref: '#/components/schemas/BranchOrganizationSummary' },
        zones: {
          type: 'array',
          items: { $ref: '#/components/schemas/ZoneSummary' }
        }
      }
    },
    BuildingCreateRequest: {
      type: 'object',
      required: ['branch_id', 'name'],
      properties: {
        branch_id: { type: 'integer', example: 4 },
        name: { type: 'string', example: 'Warehouse 12' }
      }
    },
    BuildingUpdateRequest: {
      type: 'object',
      properties: {
        branch_id: { type: 'integer', example: 4 },
        name: { type: 'string', example: 'Warehouse 12' }
      }
    },
    EmployeeOrganizationSummary: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Default Organization' }
      }
    },
    Employee: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 8 },
        organization_id: { type: 'integer', example: 1 },
        employee_code: { type: 'string', example: 'EMP-001' },
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email', nullable: true, example: 'jane.doe@example.com' },
        status: { type: 'string', example: 'ACTIVE' },
        is_active: { type: 'boolean', example: true },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        organization: { $ref: '#/components/schemas/EmployeeOrganizationSummary' }
      }
    },
    EmployeeCreateRequest: {
      type: 'object',
      required: ['employee_code', 'name'],
      properties: {
        organization_id: { type: 'integer', example: 1 },
        employee_code: { type: 'string', example: 'EMP-001' },
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email', nullable: true, example: 'jane.doe@example.com' },
        status: { type: 'string', example: 'ACTIVE' },
        is_active: { type: 'boolean', example: true }
      }
    },
    EmployeeUpdateRequest: {
      type: 'object',
      properties: {
        organization_id: { type: 'integer', example: 1 },
        employee_code: { type: 'string', example: 'EMP-001' },
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email', nullable: true, example: 'jane.doe@example.com' },
        status: { type: 'string', example: 'ACTIVE' },
        is_active: { type: 'boolean', example: true }
      }
    }
  }
};
