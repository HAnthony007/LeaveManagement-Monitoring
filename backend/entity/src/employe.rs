//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "employe")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id_empl: String,
    #[sea_orm(unique)]
    pub n_matricule: String,
    pub id_sup_hier: Option<String>,
    pub id_dep: Option<String>,
    pub nom_empl: String,
    pub prenom_empl: Option<String>,
    #[sea_orm(unique)]
    pub email_empl: String,
    pub passw_empl: String,
    pub role: String,
    pub date_embauche: Option<Date>,
    pub status: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::departement::Entity",
        from = "Column::IdDep",
        to = "super::departement::Column::IdDep",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Departement,
}

impl Related<super::departement::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Departement.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
