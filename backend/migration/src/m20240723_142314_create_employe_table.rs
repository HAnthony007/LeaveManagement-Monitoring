use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(EMPLOYE::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(EMPLOYE::IdEmpl)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(EMPLOYE::NMatricule).string().not_null().unique_key())
                    .col(ColumnDef::new(EMPLOYE::IdSupHier).string())
                    // .col(ColumnDef::new(EMPLOYE::IdDep).string())
                    .col(ColumnDef::new(EMPLOYE::IdDep).string().not_null())
                    .col(ColumnDef::new(EMPLOYE::NomEmpl).string().not_null())
                    .col(ColumnDef::new(EMPLOYE::PrenomEmpl).string())
                    .col(
                        ColumnDef::new(EMPLOYE::EmailEmpl)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(EMPLOYE::PasswEmpl).string().not_null())
                    .col(ColumnDef::new(EMPLOYE::Role).string().not_null())
                    .col(ColumnDef::new(EMPLOYE::DateEmbauche).date())
                    .col(ColumnDef::new(EMPLOYE::Status).string().not_null().default("actif"))
                    // .foreign_key(
                    //     ForeignKey::create()
                    //         .name("fk_departement")
                    //         .from(EMPLOYE::Table, EMPLOYE::IdDep)
                    //         .to(DEPARTEMENT::Table, DEPARTEMENT::IdDep)
                    //         .on_delete(ForeignKeyAction::Cascade)
                    //         .on_update(ForeignKeyAction::Cascade),
                    // )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(EMPLOYE::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub  enum EMPLOYE {
    Table,
    IdEmpl,
    NMatricule,
    IdSupHier,
    IdDep,
    NomEmpl,
    PrenomEmpl,
    EmailEmpl,
    PasswEmpl,
    Role,
    DateEmbauche,
    Status,
}
