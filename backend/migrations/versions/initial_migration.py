"""Initial migration

Revision ID: 1
Revises: 
Create Date: 2025-03-11 09:54:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Since we already created the table directly in PostgreSQL,
    # we don't need to create it again in the migration.
    # This migration is just to establish a baseline for future migrations.
    pass


def downgrade() -> None:
    # Since this is just a baseline migration, there's nothing to downgrade.
    pass
