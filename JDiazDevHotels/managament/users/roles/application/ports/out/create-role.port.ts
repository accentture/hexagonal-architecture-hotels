import { RoleDatabaseEntity } from '../../../adapter/out/role-database.entity';

export interface CreateRolePort {
    createRole(role: string): Promise<RoleDatabaseEntity>
}