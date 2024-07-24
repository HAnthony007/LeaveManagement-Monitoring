use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

        manager
            .create_table(
                Table::create()
                    .table(DEPARTEMENT::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(DEPARTEMENT::IdDep)
                            .integer()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(DEPARTEMENT::NomDep).string().not_null())
                    .col(ColumnDef::new(DEPARTEMENT::IdDir).string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(DEPARTEMENT::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum DEPARTEMENT {
    Table,
    IdDep,
    NomDep,
    IdDir
}
